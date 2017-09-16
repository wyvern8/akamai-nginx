import { Criteria } from '../criteria.js';

export class CriteriaQueryStringParameter extends Criteria {

    constructor(options, valueMap) {
        super();
        this.options = options;
        this.valueMap = valueMap;
        this.checkVar = 'ngx.req.get_uri_args()["' + options.parameterName + '"]';
    }

    process() {
        return super.process();
    }

}
Criteria.register('queryStringParameter', CriteriaQueryStringParameter);
