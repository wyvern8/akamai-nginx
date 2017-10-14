import { Behavior } from '../behavior.js';

export class BehaviorRedirect extends Behavior {

    constructor(options, valueMap) {
        super();
        this.options = options;
        this.valueMap = valueMap;
    }

    process() {
        let host = this.switchByVal({
            'SAME_AS_REQUEST': 'aka_request_host',
            'OTHER': this.value(this.options.destinationHostnameOther)
        }, 'aka_request_host', this.options.destinationHostname);

        let uri = this.switchByVal({
            'SAME_AS_REQUEST': 'aka_request_path',
            'OTHER': this.value(this.options.destinationPathOther)
        }, 'aka_request_path', this.options.destinationPath);

        let protocol = this.switchByVal({
            'SAME_AS_REQUEST': 'ngx.var.scheme',
            'OTHER': this.value(this.options.destinationProtocol.toLowerCase()),
            'HTTP': '"' + 'http' + '"',
            'HTTPS': '"' + 'https' + '"'
        }, 'ngx.var.scheme', this.options.destinationProtocol);

        let qs = this.switchByVal({
            'APPEND': 'aka_request_qs'
        }, '""', this.options.queryString);

        return [
            'ngx.var.aka_redirect_location = ' + protocol + ' .. "://" .. ' +  host + ' .. ' + uri + ' .. ' + qs,
            'ngx.var.aka_redirect_code = ' + this.value(this.options.responseCode)
        ];

    }
}
Behavior.register('redirect', BehaviorRedirect);
