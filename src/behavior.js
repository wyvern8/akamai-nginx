import { default as requireDir } from 'require-dir';
import { RuleAttribute } from './ruleAttribute.js';

export class Behavior extends RuleAttribute {

    constructor(name, options, valueMap) {
        super();
        return Behavior.create(name, options, valueMap);
    }

    process() {
        // override
    }

    processHeaderOptions(luaMapName, comment) {
        let headerName = this.switchByVal({
            'MODIFY': '"' + (this.options.standardModifyHeaderName === 'OTHER' ?
                this.options.customHeaderName : this.options.standardModifyHeaderName) + '"',

            'ADD': '"' + (this.options.standardAddHeaderName === 'OTHER' ?
                this.options.customHeaderName : this.options.standardAddHeaderName) + '"',

            'REMOVE': '"' + (this.options.standardRemoveHeaderName === 'OTHER' ?
                this.options.customHeaderName : this.options.standardRemoveHeaderName) + '"',

            'REGEX': '"' + (this.options.standardModifyHeaderName === 'OTHER' ?
                this.options.customHeaderName : this.options.standardModifyHeaderName) + '"',

        }, '"' + this.options.customHeaderName + '"', this.options.action);


        let headerValue = this.switchByVal({
            'MODIFY': this.value(this.options.newHeaderValue),
            'ADD': this.value(this.options.headerValue),
            'REMOVE': 'nil',
            'REGEX': 'string.gsub(cs(' + luaMapName + '[' + headerName + ']), "' +
                this.options.regexHeaderMatch + '", "' +
                this.options.regexHeaderReplace + '")',
        }, 'nil', this.options.action);

        return [
            '-- ' + this.options.action + ' ' + comment,
            luaMapName + '[' + headerName + '] = ' + headerValue
        ];
    }

}

requireDir('./behaviors');