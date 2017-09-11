import { Criteria } from '../criteria.js';

export class CriteriaRequestCookie extends Criteria {

    constructor(options, valueMap) {
        super();
        this.options = options;
        this.valueMap = valueMap;
        this.checkVar = 'ngx.var.cookie_ .. "' + options.cookieName + '"';
    }

    process() {
        return super.process();
    }

}
Criteria.register('requestCookie', CriteriaRequestCookie);
