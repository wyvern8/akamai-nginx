import { Behavior } from '../behavior.js';

export class BehaviorDownstreamCache extends Behavior {

    constructor(options, valueMap) {
        super();
        this.options = options;
        this.valueMap = valueMap;
    }

    process() {

        let expires = this.expires();

        let lua = this.switchByVal({
            'ALLOW':
                [
                    'aka_downstream_headers["Cache-Control"] = {"SET", "max-age=" .. ' + expires + '}',
                    'aka_downstream_headers["Expires"] = {"SET", expiryDateString(' + expires + ')}'
                ],
            'MUST_REVALIDATE':
                [
                    'aka_downstream_headers["Cache-Control"] = {"SET", "no-cache"}'
                ],
            'BUST':
                [
                    'aka_downstream_headers["Cache-Control"] = {"SET", "max-age=0, no-cache, no-store"}',
                    'aka_downstream_headers["Pragma"] = {"SET", "no-cache"}',
                    'aka_downstream_headers["Expires"] = {"SET", "1 January, 1970 00:00:01 GMT"}'
                ],
            'TUNNEL_ORIGIN':
                [
                    '-- let cache headers pass though from origin'
                ],
            'NONE':
                [
                    'aka_downstream_headers["Cache-Control"] = {"SET", nil}',
                    'aka_downstream_headers["Expires"] = {"SET", nil}',
                    'aka_downstream_headers["Pragma"] = {"SET", nil}'
                ]
        }, [], this.options.behavior);

        lua = [...lua, ...this.switchByVal({
            'PASS_ORIGIN':
                [
                    '-- let cache headers pass though'
                ],
            'CACHE_CONTROL':
                [
                    'aka_downstream_headers["Expires"] = {"SET", nil}'
                ],
            'EXPIRES':
                [
                    'aka_downstream_headers["Cache-Control"] = {"SET", nil}'
                ],
            'CACHE_CONTROL_AND_EXPIRES':
                [
                    '-- let cache headers pass though'
                ],
            'NONE':
                [
                    'aka_downstream_headers["Cache-Control"] = {"SET", nil}',
                    'aka_downstream_headers["Expires"] = {"SET", nil}',
                    'aka_downstream_headers["Pragma"] = {"SET", nil}'
                ]
        }, [], this.options.sendHeaders)];



        if (this.options.sendPrivate) {
            lua.push('ngx.header["Cache-Control"] = "private"');
        }

        return lua;
    }

    expires() {
        let expires = this.switchByVal({
            'FROM_VALUE': this.constructor.translateTTL(this.options.ttl),
            'FROM_MAX_AGE': 'ngx.var.aka_cache_ttl_seconds',
            'LESSER': 'ngx.var.aka_cache_ttl_seconds',
            'GREATER': 'ngx.var.aka_cache_ttl_seconds',
            'REMAINING_LIFETIME': 'ngx.var.aka_cache_ttl_seconds',
            'PASS_ORIGIN': ''
        }, '', this.options.allowBehavior);

        return expires;

    }
}
Behavior.register('downstreamCache', BehaviorDownstreamCache);
