import { Criteria } from '../criteria.js';

export class CriteriaClientIp extends Criteria {

    constructor(options, valueMap) {
        super();
        this.options = options;
        this.valueMap = valueMap;
        this.checkVar = 'trueClientIp()';
    }

    process() {
        return ('"NOT_ENFORCED" ~= "' + this.options.values.join(', ') + '"');

    }

}
Criteria.register('clientIp', CriteriaClientIp);
