import { Behavior } from '../behavior.js';

export class BehaviorCaching extends Behavior {

    constructor(options, valueMap) {
        super();
        this.options = options;
        this.valueMap = valueMap;
    }

    process() {

        // X-Accel-Expires

        let expireSeconds = this.switchByVal({
            'NO_STORE': 0,
            'BYPASS_CACHE': 0,
            'MAX_AGE': this.constructor.translateTTL(this.options.ttl),
            'CACHE_CONTROL': this.constructor.translateTTL(this.options.defaultTtl)
        }, 0, this.options.behavior);

        return 'ngx.var.aka_cache_ttl_seconds = ' + expireSeconds;
        
    }

    static translateTTL(ttl) {
        if (!ttl) return 0;
        let ttlSeconds = 0;
        let ttlInt = parseInt(ttl.substring(0, ttl.length - 1));
        switch (ttl.slice(-1)) {
        case 's':
            ttlSeconds = ttlInt;
            break;
        case 'm':
            ttlSeconds = ttlInt * 60;
            break;
        case 'h':
            ttlSeconds = ttlInt * 60 * 60;
            break;
        case 'd':
            ttlSeconds = ttlInt * 60 * 60 * 24;
            break;
        }
        return ttlSeconds;
    }
}
Behavior.register('caching', BehaviorCaching);
