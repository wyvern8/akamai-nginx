import { Behavior } from '../behavior.js';

export class BehaviorGzipResponse extends Behavior {

    constructor(options, valueMap) {
        super();
        this.options = options;
        this.valueMap = valueMap;
    }

    process() {

        return [
            '-- conditional gzip of response is not easily doable..',
            'ngx.header["X-AKA-gzipResponse"] = "true"',
            'aka_gzip = "on"'
        ];
    }
}
Behavior.register('gzipResponse', BehaviorGzipResponse);
