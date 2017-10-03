import { Criteria } from '../criteria.js';

export class CriteriaPath extends Criteria {

    constructor(options, valueMap) {
        super();
        this.options = options;
        this.valueMap = valueMap;
        this.checkVar = 'aka_request_path';
    }

    process() {
        let usePattern = true;
        let valueSuffix = '*'; // path is a special case as it matches as a prefix always
        return super.process(usePattern, valueSuffix);
    }

}
Criteria.register('path', CriteriaPath);
