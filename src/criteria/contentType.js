import { Criteria } from '../criteria.js';

export class CriteriaContentType extends Criteria {

    constructor(options, valueMap) {
        super();
        this.options = options;
        this.valueMap = valueMap;
        this.checkVar = 'ngx.header["Content-Type"]';
    }

    process() {
        return super.process();
    }

}
Criteria.register('contentType', CriteriaContentType);
