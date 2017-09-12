import { Behavior } from '../behavior.js';

export class BehaviorDenyAccess extends Behavior {

    constructor(options, valueMap) {
        super();
        this.options = options;
        this.valueMap = valueMap;
    }

    process() {
        return this.options.enabled ? 'ngx.var.aka_deny_reason = "' + this.value(this.options.reason) + '"'
            : [
                '-- denyAccess disabled: ' + this.options.reason,
                'ngx.var.aka_deny_reason = ""'
            ];
    }
}
Behavior.register('denyAccess', BehaviorDenyAccess);
