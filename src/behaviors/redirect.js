import { Behavior } from '../behavior.js';

export class BehaviorRedirect extends Behavior {

    constructor(options, valueMap, skipBehaviors) {
        super();
        this.options = options;
        this.valueMap = valueMap;
        this.skipBehaviors = skipBehaviors;
    }

    switchByVal(cases, defaultCase, key) {
        return key in cases ? cases[key] : defaultCase;
    }

    process() {
        let host = this.switchByVal({
            'SAME_AS_REQUEST': 'ngx.var.host',
            'OTHER': '"' + this.value(this.options.destinationHostnameOther) + '"'
        }, 'ngx.var.host', this.options.destinationHostname);

        let uri = this.switchByVal({
            'SAME_AS_REQUEST': 'akamaiuri',
            'OTHER': '"' + this.value(this.options.destinationPathOther) + '"'
        }, 'akamaiuri', this.options.destinationPath);

        let protocol = this.switchByVal({
            'SAME_AS_REQUEST': 'ngx.var.scheme',
            'OTHER': '"' + this.value(this.options.destinationProtocol.toLowerCase()) + '"',
            'HTTP': '"' + 'http' + '"',
            'HTTPS': '"' + 'https' + '"'
        }, 'ngx.var.scheme', this.options.destinationProtocol);

        return 'ngx.redirect(' + protocol + ' .. "://" .. ' +  host + ' .. ' + uri + ', '
            + this.value(this.options.responseCode) + ')';

    }
}
Behavior.register('redirect', BehaviorRedirect);
