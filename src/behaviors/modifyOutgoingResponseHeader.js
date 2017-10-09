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

        return this.processHeaderOptions('aka_downstream_headers', 'response header to client', true);

    }
}
Behavior.register('modifyOutgoingResponseHeader', BehaviorModifyOutgoingResponseHeader);
// reusing the above for now
Behavior.register('modifyIncomingResponseHeader', BehaviorModifyOutgoingResponseHeader);
