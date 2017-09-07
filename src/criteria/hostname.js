import { Criteria } from '../criteria.js';

export class CriteriaHostname extends Criteria {

    constructor(options, valueMap) {
        super();
        this.options = options;
        this.valueMap = valueMap;
        this.checkVar = 'ngx.var.host';
    }

    process() {
        return super.process();
    }

}
Criteria.register('hostname', CriteriaHostname);
