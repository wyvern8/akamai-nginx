import { Criteria } from '../criteria.js';

export class CriteriaRequestMethod extends Criteria {

    constructor(options, valueMap) {
        super();
        this.options = options;
        this.valueMap = valueMap;
        this.checkVar = 'ngx.req.get_method()';
    }

    process() {
        return super.process();
    }

}
Criteria.register('requestMethod', CriteriaRequestMethod);
