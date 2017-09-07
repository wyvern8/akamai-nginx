import { Behavior } from '../behavior.js';

export class BehaviorRedirect extends Behavior {

    constructor(options, valueMap, skipBehaviors) {
        super();
        this.options = options;
        this.valueMap = valueMap;
        this.skipBehaviors = skipBehaviors;
    }

    process() {

        let host = this.options.destinationHostname === 'SAME_AS_REQUEST' ?
            'ngx.var.host' : '"' + this.value(this.options.destinationHostname) + '"';

        let uri = this.options.destinationPath === 'SAME_AS_REQUEST' ?
            'akamaiuri' : '"' + this.value(this.options.destinationPath) + '"';

        let protocol = this.options.destinationProtocol === 'SAME_AS_REQUEST' ?
            'ngx.var.scheme' : '"' + this.value(this.options.destinationProtocol.toLowerCase()) + '://"';

        return 'ngx.redirect(' + protocol + ' .. ' +  host + ' .. ' + uri + ', ' + this.value(this.options.responseCode) + ')';

    }
}
Behavior.register('redirect', BehaviorRedirect);
