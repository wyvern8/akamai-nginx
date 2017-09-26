import { Behavior } from '../behavior.js';

export class BehaviorModifyOutgoingResponseHeader extends Behavior {

    constructor(options, valueMap) {
        super();
        this.options = options;
        this.valueMap = valueMap;
    }

    switchByVal(cases, defaultCase, key) {
        return key in cases ? cases[key] : defaultCase;
    }

    process() {

        let headerName = this.switchByVal({
            'MODIFY': '"' + (this.options.standardModifyHeaderName === 'OTHER' ?
                this.options.customHeaderName : this.options.standardModifyHeaderName) + '"',

            'ADD': '"' + (this.options.standardAddHeaderName === 'OTHER' ?
                this.options.customHeaderName : this.options.standardAddHeaderName) + '"',

            'REMOVE': '"' + (this.options.standardRemoveHeaderName === 'OTHER' ?
                this.options.customHeaderName : this.options.standardRemoveHeaderName) + '"',

        }, this.options.customHeaderName, this.options.action);


        let headerValue = this.switchByVal({
            'MODIFY': '"' + this.value(this.options.newHeaderValue) + '"',
            'ADD': '"' + this.value(this.options.headerValue) + '"',
            'REMOVE': 'nil'
        }, '', this.options.action);

        return [
            '-- ' + this.options.action + ' response header to client',
            'ngx.header[' + headerName + '] = ' + headerValue
        ];

    }
}
Behavior.register('modifyOutgoingResponseHeader', BehaviorModifyOutgoingResponseHeader);
// reusing the above for now
Behavior.register('modifyIncomingResponseHeader', BehaviorModifyOutgoingResponseHeader);
