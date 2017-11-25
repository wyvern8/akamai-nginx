import { Behavior } from '../behavior.js';

export class BehaviorOrigin extends Behavior {

    constructor(options, valueMap) {
        super();
        this.options = options;
        this.valueMap = valueMap;
    }

    process() {
        let lua = [];

        if (this.options.originType === 'CUSTOMER') {
            lua.push('ngx.var.aka_origin_host = ' + this.value(this.options.hostname));

            let forwardHostHeader = this.switchByVal({
                'ORIGIN_HOSTNAME': this.value(this.options.hostname),
                'REQUEST_HOST_HEADER': 'mapValue(aka_request_host)',
                'CUSTOM': this.value(this.options.customForwardHostHeader)
            }, this.value(this.options.hostname), this.options.forwardHostHeader);

            lua.push('ngx.var.aka_origin_host_header = ' + forwardHostHeader);

            if (this.options.enableTrueClientIp) {
                // True-Client-IP request header is set by nginx-edge.conf and passed on here
                lua.push('aka_upstream_headers["' + this.options.trueClientIpHeader + '"] = ' +
                    'ngx.req.get_headers()["True-Client-IP"]');
            }

        } else {
            lua.push('-- unsupported origin type: ' + this.options.originType);
        }

        return lua;
    }
}
Behavior.register('origin', BehaviorOrigin);

