import { Behavior } from '../behavior.js';

export class BehaviorAllowPost extends Behavior {

    constructor(options, valueMap) {
        super();
        this.options = options;
        this.valueMap = valueMap;
    }

    process() {
        return this.processRequestMethodOptions('POST', this.options);
    }
}
Behavior.register('allowPost', BehaviorAllowPost);
