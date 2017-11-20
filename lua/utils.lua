-- #### START utils.lua

-- split a string
function string:split(delimiter)
    local result = { }
    local from  = 1
    local delim_from, delim_to = string.find( self, delimiter, from  )
    while delim_from do
        table.insert( result, string.sub( self, from , delim_from-1 ) )
        from  = delim_to + 1
        delim_from, delim_to = string.find( self, delimiter, from  )
    end
    table.insert( result, string.sub( self, from  ) )
    return result
end

-- get table size
local function tablelength(T)
    local count = 0
    for _ in pairs(T) do count = count + 1 end
    return count
end

-- checked string for concatenation
function cs(s)
    if s == nil then
        s = ""
    end
    return s
end

function matches(value, glob)
    local pattern = globtopattern(glob)
    return (cs(value)):match(pattern)
end

-- 1 January, 1970 00:00:01 GMT
function expiryDateString(secs)
    local dt = os.date("!*t");
    if secs ~= nil and secs ~= "" then
        dt.sec = dt.sec + secs
    end
    return os.date("%d %B %Y %H:%M:%S GMT", os.time(dt))
end

function globtopattern(g)
    -- Some useful references:
    -- - apr_fnmatch in Apache APR.  For example,
    --   http://apr.apache.org/docs/apr/1.3/group__apr__fnmatch.html
    --   which cites POSIX 1003.2-1992, section B.6.

    local p = "^"  -- pattern being built
    local i = 0    -- index in g
    local c        -- char at index i in g.

    -- unescape glob char
    local function unescape()
        if c == '\\' then
            i = i + 1; c = g:sub(i,i)
            if c == '' then
                p = '[^]'
                return false
            end
        end
        return true
    end

    -- escape pattern char
    local function escape(c)
        return c:match("^%w$") and c or '%' .. c
    end

    -- Convert tokens at end of charset.
    local function charset_end()
        while 1 do
            if c == '' then
                p = '[^]'
                return false
            elseif c == ']' then
                p = p .. ']'
                break
            else
                if not unescape() then break end
                local c1 = c
                i = i + 1; c = g:sub(i,i)
                if c == '' then
                    p = '[^]'
                    return false
                elseif c == '-' then
                    i = i + 1; c = g:sub(i,i)
                    if c == '' then
                        p = '[^]'
                        return false
                    elseif c == ']' then
                        p = p .. escape(c1) .. '%-]'
                        break
                    else
                        if not unescape() then break end
                        p = p .. escape(c1) .. '-' .. escape(c)
                    end
                elseif c == ']' then
                    p = p .. escape(c1) .. ']'
                    break
                else
                    p = p .. escape(c1)
                    i = i - 1 -- put back
                end
            end
            i = i + 1; c = g:sub(i,i)
        end
        return true
    end

    -- Convert tokens in charset.
    local function charset()
        i = i + 1; c = g:sub(i,i)
        if c == '' or c == ']' then
            p = '[^]'
            return false
        elseif c == '^' or c == '!' then
            i = i + 1; c = g:sub(i,i)
            if c == ']' then
                -- ignored
            else
                p = p .. '[^'
                if not charset_end() then return false end
            end
        else
            p = p .. '['
            if not charset_end() then return false end
        end
        return true
    end

    -- Convert tokens.
    while 1 do
        i = i + 1; c = g:sub(i,i)
        if c == '' then
            p = p .. '$'
            break
        elseif c == '?' then
            p = p .. '.'
        elseif c == '*' then
            p = p .. '.*'
        elseif c == '[' then
            if not charset() then break end
        elseif c == '\\' then
            i = i + 1; c = g:sub(i,i)
            if c == '' then
                p = p .. '\\$'
                break
            end
            p = p .. escape(c)
        else
            p = p .. escape(c)
        end
    end
    return p
end

-- ################ vars for reference in criteria and behaviours
local aka_request_scheme = ngx.var.scheme
local aka_request_host = ngx.var.host
local aka_request_path = ngx.var.document_uri
local aka_request_method = ngx.var.request_method
local aka_request_file_extension_all = cs(aka_request_path:match("^.+(%..+)$"))
local aka_request_file_extension = aka_request_file_extension_all:gsub("%.", "")
local aka_request_uri_parts = aka_request_path:split("/")
local aka_request_file_name = aka_request_uri_parts[tablelength(aka_request_uri_parts)]
local aka_request_qs = ngx.var.query_string
local aka_origin_url = nil
local aka_cache_ttl_seconds = nil
local aka_gzip = nil

if aka_request_qs == nil then
    aka_request_qs = ""
else
    aka_request_qs = "?" .. aka_request_qs
end

ngx.log(ngx.ERR,
"### incoming request details >> \n" ..
"--------------------------------------------------\n" ..
"aka_request_scheme: " .. cs(aka_request_scheme) .. "\n" ..
"aka_request_method: " ..cs(aka_request_method) .. "\n" ..
"aka_request_host: " .. cs(aka_request_host) .. "\n" ..
"aka_request_path: " .. cs(aka_request_path) .. "\n" ..
"aka_request_file_extension: " .. cs(aka_request_file_extension) .. "\n" ..
"aka_request_file_name: " .. cs(aka_request_file_name) .. "\n" ..
"aka_request_qs: " .. cs(aka_request_qs) .. "\n" ..
"--------------------------------------------------\n"
)

-- table to contain manage headers sent to origin
local aka_upstream_headers = ngx.req.get_headers()
local aka_downstream_headers = { }

local aka_request_method_status = { }
aka_request_method_status["GET"] = "ALLOW"

-- #### END utils.lua