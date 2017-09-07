import { Criteria } from '../criteria.js';

export class CriteriaRequestProtocol extends Criteria {

    constructor(options, valueMap) {
        super();
        this.options = options;
        this.valueMap = valueMap;
        this.checkVar = 'ngx.var.scheme';
    }

    process() {
        return super.process();
    }

}
Criteria.register('requestProtocol', CriteriaRequestProtocol);
