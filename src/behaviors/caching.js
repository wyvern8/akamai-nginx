import { Behavior } from '../behavior.js';

export class BehaviorCaching extends Behavior {

    constructor(options, valueMap) {
        super();
        this.options = options;
        this.valueMap = valueMap;
    }

    process() {
        // just setting a response header for now.
        return 'ngx.header["x-aka-' + this.options.behavior + '"] = "' + this.options.ttl + '"';
    }
}
Behavior.register('caching', BehaviorCaching);
