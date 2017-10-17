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
            'ngx.header["X-AKA-gzipResponse"] = "TODO_this_request_should_be_gzipped_by_proxy"',
            'aka_gzip = "on"'
        ];
    }
}
Behavior.register('gzipResponse', BehaviorGzipResponse);
