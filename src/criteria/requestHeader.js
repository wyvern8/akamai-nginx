import { Criteria } from '../criteria.js';

export class CriteriaRequestHeader extends Criteria {

    constructor(options, valueMap) {
        super();
        this.options = options;
        this.valueMap = valueMap;
        this.checkVar = 'ngx.req.get_headers()["' + options.headerName + '"]';
    }

    process() {
        return super.process();
    }

}
Criteria.register('requestHeader', CriteriaRequestHeader);
