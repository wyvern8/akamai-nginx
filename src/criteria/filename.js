import { Criteria } from '../criteria.js';

export class CriteriaFilename extends Criteria {

    constructor(options, valueMap) {
        super();
        this.options = options;
        this.valueMap = valueMap;
        this.checkVar = 'aka_request_file_name';
    }

    process() {
        return super.process();
    }

}
Criteria.register('filename', CriteriaFilename);
