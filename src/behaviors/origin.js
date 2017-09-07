import { Behavior } from '../behavior.js';

export class BehaviorOrigin extends Behavior {

    constructor(options, valueMap, skipBehaviors) {
        super();
        this.options = options;
        this.valueMap = valueMap;
        this.skipBehaviors = skipBehaviors;
    }

    process() {
        return 'ngx.var.origin = "' + this.value(this.options.hostname) + '"';
    }
}
Behavior.register('origin', BehaviorOrigin);
