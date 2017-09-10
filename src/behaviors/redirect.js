import { Behavior } from '../behavior.js';

export class BehaviorRedirect extends Behavior {

    constructor(options, valueMap, skipBehaviors) {
        super();
        this.options = options;
        this.valueMap = valueMap;
        this.skipBehaviors = skipBehaviors;
    }

    process() {

        let host = 'ngx.var.host';
        switch (this.options.destinationPath) {
            case 'SAME_AS_REQUEST' : {
                host = '"' + this.value(this.options.destinationHostname) + '"'
            }
            case 'OTHER' : {
                host = '"' + this.value(this.options.destinationHostnameOther) + '"'
            }
        }

        let uri = 'akamaiuri';
        switch (this.options.destinationPath) {
            case 'SAME_AS_REQUEST' : {
                uri= '"' + this.value(this.options.destinationPath) + '"'
            }
            case 'OTHER' : {
                uri = '"' + this.value(this.options.destinationPathOther) + '"'
            }
        }

        let protocol = this.options.destinationProtocol === 'SAME_AS_REQUEST' ?
            'ngx.var.scheme' : '"' + this.value(this.options.destinationProtocol.toLowerCase()) + '"';

        return 'ngx.redirect(' + protocol + ' .. "://" .. ' +  host + ' .. ' + uri + ', ' + this.value(this.options.responseCode) + ')';

    }
}
Behavior.register('redirect', BehaviorRedirect);
