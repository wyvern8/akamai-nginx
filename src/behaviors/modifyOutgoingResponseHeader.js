import { Behavior } from '../behavior.js';

export class BehaviorModifyOutgoingResponseHeader extends Behavior {

    constructor(options, valueMap) {
        super();
        this.options = options;
        this.valueMap = valueMap;
    }

    process() {
        return this.processHeaderOptions('aka_downstream_headers', 'response header to client', true);
    }
}
Behavior.register('modifyOutgoingResponseHeader', BehaviorModifyOutgoingResponseHeader);
// reusing the above for now
Behavior.register('modifyIncomingResponseHeader', BehaviorModifyOutgoingResponseHeader);
