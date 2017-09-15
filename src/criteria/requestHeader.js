import { Criteria } from '../criteria.js';

export class CriteriaRequestHeader extends Criteria {

    constructor(options, valueMap) {
        super();
        this.options = options;
        this.valueMap = valueMap;
        this.checkVar = 'ngx.req_header["' + options.headerName + '"]';
    }

    process() {
        return super.process();
    }

}
Criteria.register('requestHeader', CriteriaRequestHeader);
