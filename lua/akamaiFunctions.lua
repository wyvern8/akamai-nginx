-- vars for reference in criteria and behaviours
local aka_request_host = ngx.var.host
local aka_request_path = ngx.var.document_uri
local aka_request_qs = ngx.var.query_string

-- default origin request url
-- ngx.var.aka_origin_url = aka_request_path .. "?" .. aka_request_qs

-- supporting functions
function string.starts(String,Start)
    return string.sub(String,1,string.len(Start))==Start
end

function string.ends(String,End)
    return End=='' or string.sub(String,-string.len(End))==End
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

function matches(value, glob)
    local pattern = globtopattern(glob)
    return (value):match(pattern)
end

function applyVarLogic()

    if ngx.var.aka_deny_reason ~= nil and ngx.var.aka_deny_reason ~= "" then

        ngx.var.aka_origin_host = ''
        ngx.header.content_type = 'text/plain';
        ngx.status = ngx.HTTP_UNAUTHORIZED
        ngx.say("access denied: " .. ngx.var.aka_deny_reason)
        ngx.exit(ngx.HTTP_OK)

    end

    -- if redirect calculated, do it
    if ngx.var.aka_redirect_location ~= nil and ngx.var.aka_redirect_location ~= "" then
        ngx.redirect(ngx.var.aka_redirect_location, ngx.var.aka_redirect_code)
    end

    -- set headers




end



