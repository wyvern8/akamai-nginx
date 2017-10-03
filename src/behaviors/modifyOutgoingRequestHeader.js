import { Behavior } from '../behavior.js';

export class BehaviorModifyOutgoingRequestHeader extends Behavior {

    constructor(options, valueMap) {
        super();
        this.options = options;
        this.valueMap = valueMap;
    }

    switchByVal(cases, defaultCase, key) {
        return key in cases ? cases[key] : defaultCase;
    }

    process() {

        return this.processHeaderOptions('aka_upstream_headers', 'request header to origin');

    }
}
Behavior.register('modifyOutgoingRequestHeader', BehaviorModifyOutgoingRequestHeader);
// reusing the above for now
Behavior.register('modifyIncomingRequestHeader', BehaviorModifyOutgoingRequestHeader);
