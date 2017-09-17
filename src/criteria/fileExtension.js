import { Criteria } from '../criteria.js';

export class CriteriaFileExtension extends Criteria {

    constructor(options, valueMap) {
        super();
        this.options = options;
        this.valueMap = valueMap;
        this.checkVar = 'aka_request_file_extension';
    }

    process() {
        return super.process();
    }

}
Criteria.register('fileExtension', CriteriaFileExtension);
