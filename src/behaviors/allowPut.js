import { Behavior } from '../behavior.js';

export class BehaviorAllowPut extends Behavior {

    constructor(options, valueMap) {
        super();
        this.options = options;
        this.valueMap = valueMap;
    }

    process() {
        return this.processRequestMethodOptions('PUT', this.options);
    }
}
Behavior.register('allowPut', BehaviorAllowPut);
