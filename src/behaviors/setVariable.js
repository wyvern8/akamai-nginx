import { Behavior } from '../behavior.js';

export class BehaviorSetVariable extends Behavior {

    constructor(options, valueMap) {
        super();
        this.options = options;
        this.valueMap = valueMap;
    }

    process() {
        return [
            'varMap["' + this.options.variableName + '"] = function()',
            '\tlocal function setVar()',

            ...this.setVariableLua(this.options).map((e) => {return '\t\t' + e;}),

            '\tend',
            '\treturn setVar()',
            'end'
        ];
    }

    setVariableLua(options) {

        let lua = ['local result'];

        if (options.valueSource === 'EXPRESSION') {
            lua.push(...[
                '-- EXPRESSION',
                'result = swapVars("' + options.variableValue + '")'
            ]);
        }

        if (options.valueSource === 'GENERATE') {
            lua.push('-- GENERATE: ' + options.generator);
            lua.push(...
                this.switchByVal({
                    'RAND': [
                        'math.randomseed(os.time())',
                        'result = math.random(' + options.minRandomNumber + ', ' + options.maxRandomNumber + ')'
                    ]
                }, '-- not supported yet.', options.generator)
            );
        }

        if (options.valueSource === 'EXTRACT') {
            lua.push('-- EXTRACT: ' + options.extractLocation);
            lua.push(...[
                this.switchByVal({
                    'COOKIE':
                        'result = cs(ngx.var["cookie_' + options.cookieName + '"])',

                    'CLIENT_REQUEST_HEADER':
                        'result = cs(ngx.req.get_headers()["' + options.headerName + '"])',

                    'QUERY_STRING':
                        'result = cs(ngx.req.get_uri_args()["' + options.queryParameterName + '"])',

                    'PATH_COMPONENT_OFFSET':
                        'result = cs(aka_request_uri_parts[' + options.pathComponentOffset + '])',

                }, '-- not supported yet.', options.extractLocation)
            ]);
        }

        if (options.transform === 'NONE') {
            lua.push('return result');

        } else {
            lua.push(...[
                '-- TRANSFORM: ' + options.transform,
                'local options = { }'
            ]);

            Object.keys(options).forEach((key) => {
                lua.push('options["' + key + '"] = "' + options[key] + '"');
            });

            lua.push('return transformVariable(result, options)');

        }

        return lua;

    }

}
Behavior.register('setVariable', BehaviorSetVariable);

/**
 * Option breakdown condensed from https://developer.akamai.com/api/luna/papi/behaviors.html#setvariable
 * ----------------------------
 {
  "variableName": "PMUSER_EXAMPLE_VAR_NAME",

  "valueSource" = GENERATE
    "generator":
        RAND + use "minRandomNumber", "maxRandomNumber"
        HEXRAND + use "numberOfBytes"

  valueSource = EXTRACT
    "extractLocation":
        COOKIE + use "cookieName"
        CLIENT_REQUEST_HEADER + use "headerName"
        QUERY_STRING + use "queryParameterName"
        PATH_COMPONENT_OFFSET + use "pathComponentOffset"

        CLIENT_CERTIFICATE=notsupported,
        EDGESCAPE=notsupported,
        PATH_COMPONENT_NAME=notsupported,
        PATH_PARAMETER=notsupported,

  valueSource = EXPRESSION
    "variableValue": "abc {{builtin.AK_HOST}} def"

  transform: common to all valueSource results
        NONE=do nothing
        ADD, SUBTRACT, MINUS, MULTIPLY, DIVIDE, MODULO + use "operandOne"
        LOWER, UPPER, STRING_LENGTH, REMOVE_WHITESPACE, TRIM
        SUBSTITUTE + use "regex", "replacement", "caseSensitive", "globalSubstitution"
            "replacement" supports group capture replacement via $1, $2 … $n
        SUBSTRING + use "startIndex", "endIndex"
        STRING_INDEX + use "subString"
        URL_ENCODE + use "exceptChars", "forceChars"
        HEX_ENCODE, HEX_DECODE, XML_ENCODE, XML_DECODE, URL_DECODE, URL_DECODE_UNI, NORMALIZE_PATH_WIN
        BITWISE_AND, BITWISE_OR, BITWISE_XOR + use "operandOne"
        BITWISE_NOT
        DECIMAL_TO_HEX, HEX_TO_DECIMAL
        DECRYPT/ENCRYPT, + use "algorithm", "encryptionKey", "initializationVector",
            "encryptionMode(CBC/ECB", "nonce", "prependBytes"
            (ALG_AES128 or ALG_AES256 (Advanced Encryption Standard, 128 or 256 bits), or ALG_3DES)
        BASE_64_ENCODE/BASE_64_DECODE
        SHA_1, SHA_256, MD5, a base64-encoded HMAC key, or a simple HASH
            HMAC + use "hmacKey", "hmacAlgorithm" (MD5, SHA1, or SHA256) - HASH + use "min", "max"
        UTC_SECONDS (epoch time), EPOCH_TO_STRING, and STRING_TO_EPOCH + use "formatString"
            %m/%d/%y as specified by strftime
        NETMASK + use "ipVersion" (IPV4 or IPV6), "ipv6Prefix", "ipv4Prefix"
        EXTRACT_PARAM + use "paramName", "separator"



} **/