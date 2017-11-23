-- #### START akamaiFunctions.lua

-- executed after all criteria and behavior are evaluated to apply final actions
function finalActions()

    ngx.var.aka_gzip = aka_gzip

    -- deal with an calculated access controls
    if ngx.var.aka_deny_reason ~= nil and ngx.var.aka_deny_reason ~= "" then
        ngx.var.aka_origin_host = ""
        ngx.header.content_type = "text/plain";
        ngx.status = ngx.HTTP_UNAUTHORIZED
        ngx.log(ngx.ERR, "access denied: " .. ngx.var.aka_deny_reason)
        ngx.say("access denied: " .. ngx.var.aka_deny_reason)
        ngx.exit(ngx.HTTP_UNAUTHORIZED)
    end

    -- deal with request method restrictions
    if aka_request_method_status[aka_request_method] == nil or aka_request_method_status[aka_request_method] ~= "ALLOW" then
        ngx.log(ngx.ERR, aka_request_method_status[aka_request_method])
        ngx.var.aka_origin_host = ""
        ngx.header.content_type = "text/plain";
        ngx.status = ngx.HTTP_NOT_ALLOWED
        ngx.log(ngx.ERR, "method not allowed: " .. aka_request_method)
        ngx.say("method not allowed: " .. aka_request_method)
        ngx.exit(ngx.HTTP_NOT_ALLOWED)
    end

    -- if redirect calculated, do it
    if ngx.var.aka_redirect_location ~= nil and ngx.var.aka_redirect_location ~= "" then
        ngx.log(ngx.ERR, "redirecting to: " .. ngx.var.aka_redirect_location .. " as " .. ngx.var.aka_redirect_code)
        ngx.redirect(ngx.var.aka_redirect_location, ngx.var.aka_redirect_code)
    end

    -- set upstream headers modified by behaviors
    for key,value in pairs(aka_upstream_headers) do
        ngx.req.set_header(key, value)
    end

    -- if we have not manipulated the path or qs, pass through to origin as is.
    if aka_origin_url == nil or aka_origin_url == "" then
        aka_origin_url = aka_request_path .. aka_request_qs
    end

    ngx.ctx["aka_downstream_headers"] = aka_downstream_headers

    ngx.var.aka_origin_url = aka_origin_url
    ngx.var.aka_origin_scheme = aka_request_scheme
    ngx.log(ngx.ERR, "origin request: " .. ngx.var.aka_origin_scheme .. "://" .. ngx.var.aka_origin_host .. ngx.var.aka_origin_url)

end

function mapValue(val)
    if val == nil then
        return ""
    end

    if valueMap[val] == nil then
        return val
    else
        return valueMap[val]
    end
end

ngx.ctx["cs"] = cs
ngx.ctx["mapValue"] = mapValue

function getVar(var)
    local fn = varMap[var]
    if fn ~= nil then
        return fn()
    end
end

function getVarNumber(var)
    local result
    local varString = getVar(var)
    if not tonumber(varString) then
        result = -1
    else
        result = tonumber(varString)
    end
    return result
end

function swapVars(value)
    local result = value
    for token in string.gmatch( value, "(%{%{[^%.]*%.[^%}]*%}%})" ) do
        -- ngx.log(ngx.ERR, token)
        local var = string.match( token, "%.([^%}]*)%}" )

        local replacement = getVar(var)

        if replacement ~= nil then
            ngx.log(ngx.ERR, "replacing var: " .. token .. " with [" .. replacement .. "]")
            result = result:gsub( "%{%{[^%.]*%." .. var .. "%}%}", replacement)
        else
            ngx.log(ngx.ERR, "removing unresolved var: " .. token)
            result = result:gsub( "%{%{[^%.]*%." .. var .. "%}%}", "")
        end
    end
    -- recurse if a var contained a var..
    if result:match("(%{%{[^%.]*%.[^%}]*%}%})" ) then
        result = swapVars(result)
    end
    return result;
end

function hostDomain(hostname)
    local parts = hostname:split(".")

    if #parts > 2 then
        local domain = ""
        for i = 2, #parts-1 do
            domain = domain .. parts[i] .. "."
        end
        domain = domain .. parts[#parts]
        return domain
    else
        return hostname
    end

end

function basePath(requestpath)
    local parts = requestpath:split("/")

    local result = ""
    for i = 2, #parts-1 do
        result = "/" .. parts[i]
    end
    return result

end

function trueClientIp()
    if ngx.header["X-Forwarded-For"] ~= nil then
        return ngx.header["X-Forwarded-For"]
    end
    if ngx.header["Akamai-Client-IP"] ~= nil then
        return ngx.header["Akamai-Client-IP"]
    end
    return ngx.var.remote_addr
end

function transformVariable(oldValue, options)

    local newValue
    local transformers = { }

    -- arithmetic
    transformers['NONE'] = function(val, opts) return val end
    transformers['ADD'] = function(val, opts) return tonumber(val) + tonumber(swapVars(opts.operandOne)) end
    transformers['SUBTRACT'] = function(val, opts) return tonumber(val) - tonumber(swapVars(opts.operandOne)) end
    transformers['MINUS'] = function(val, opts) return tonumber(val) * -1 end
    transformers['MULTIPLY'] = function(val, opts) return tonumber(val) * tonumber(swapVars(opts.operandOne)) end
    transformers['DIVIDE'] = function(val, opts) return tonumber(val) / tonumber(swapVars(opts.operandOne)) end
    transformers['MODULO'] = function(val, opts) return tonumber(val) % tonumber(swapVars(opts.operandOne)) end
    -- TODO: EXTRACT_PARAM + use "swapVars(paramName)", "separator"

    -- string
    transformers['LOWER'] = function(val, opts) return string.lower(val) end
    transformers['UPPER'] = function(val, opts) return string.upper(val) end
    transformers['STRING_LENGTH'] = function(val, opts) return string.len(val) end
    transformers['REMOVE_WHITESPACE'] = function(val, opts) return string.gsub(val, "%s+", "") end
    transformers['TRIM'] = function(val, opts) return string.gsub(val, "^%s*(.-)%s*$", "%1") end
    transformers['SUBSTITUTE'] = function(val, opts) return string.gsub(val, opts.regex, swapVars(opts.replacement)) end
        -- TODO+ use "regex", "replacement", "caseSensitive", "globalSubstitution"
        -- "replacement" supports group capture replacement via $1, $2 … $n

    transformers['SUBSTRING'] =
        function(val, opts)
            return string.sub(val, tonumber(swapVars(opts.startIndex)), tonumber(swapVars(opts.endIndex)))
        end

    transformers['STRING_INDEX'] =
        function(val, opts)
            local result = string.find(val, swapVars(opts.subString))
            if result == nil then
                result = -1
            end
            return result
        end

    -- encoding and decoding
    transformers['URL_ENCODE'] = function(val, opts) return urlencode(val) end -- TODO: exceptChars, forceChars
    transformers['URL_DECODE'] = function(val, opts) return urldecode(val) end
    transformers['HEX_ENCODE'] = function(val, opts) return string.tohex(val) end
    transformers['HEX_DECODE'] = function(val, opts) return string.fromhex(val) end
    -- TODO: XML_ENCODE, XML_DECODE, URL_DECODE_UNI, NORMALIZE_PATH_WIN

    -- bitwise operations
    -- TODO: BITWISE_AND, BITWISE_OR, BITWISE_XOR + use "operandOne" BITWISE_NOT

    -- numeric conversion
    transformers['DECIMAL_TO_HEX'] = function(val, opts) return decimalToHex(val) end
    transformers['HEX_TO_DECIMAL'] = function(val, opts) return hexToDecimal(val) end

    -- encoding/decoding
    -- TODO: DECRYPT, ENCRYPT
    transformers['BASE_64_ENCODE'] = function(val, opts) return base64encode(val) end
    transformers['BASE_64_DECODE'] = function(val, opts) return base64decode(val) end

    -- hash
    -- TODO: SHA_1, SHA_256, MD5, HMAC, HASH

    -- time formats
    transformers['UTC_SECONDS'] = function(val, opts) return os.time() end
    transformers['EPOCH_TO_STRING'] = function(val, opts) return os.date(opts.formatString, os.time(val)) end
    -- TODO: STRING_TO_EPOCH
    -- %m/%d/%y as specified by strftime

    -- networking
    -- TODO: NETMASK + use "ipVersion" (IPV4 or IPV6), "ipv6Prefix", "ipv4Prefix"


    local func = transformers[options["transform"]]
    if (func) then
        newValue = func(oldValue, options)
    else
        newValue = oldValue
    end

    return newValue
end

-- #### END akamaiFunctions.lua

