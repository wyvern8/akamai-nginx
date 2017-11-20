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

function swapVars(value)
    local result = value
    for token in string.gmatch( value, "(%{%{[^%.]*%.[^%}]*%}%})" ) do
        -- ngx.log(ngx.ERR, token)
        local var = string.match( token, "%.([^%}]*)%}" )

        local replacement

        local fn = varMap[var]
        if fn ~= nil then
            replacement = fn()
        end

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

-- #### END akamaiFunctions.lua

