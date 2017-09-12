import { Behavior } from '../behavior.js';

export class BehaviorOrigin extends Behavior {

    constructor(options, valueMap) {
        super();
        this.options = options;
        this.valueMap = valueMap;
    }

    process() {
        return 'ngx.var.aka_origin_host = "' + this.value(this.options.hostname) + '"';
    }
}
Behavior.register('origin', BehaviorOrigin);
