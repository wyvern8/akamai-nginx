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


}
Behavior.register('caching', BehaviorCaching);
