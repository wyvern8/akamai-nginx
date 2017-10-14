import { Criteria } from '../criteria.js';

export class CriteriaUserAgent extends Criteria {

    constructor(options, valueMap) {
        super();
        this.options = options;
        this.valueMap = valueMap;
        this.checkVar = 'ngx.req.get_headers()["user-agent"]';
    }

    process() {
        return super.process();
    }

}
Criteria.register('userAgent', CriteriaUserAgent);
