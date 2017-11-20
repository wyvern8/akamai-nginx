import { Criteria } from '../criteria.js';

export class CriteriaMatchVariable extends Criteria {

    constructor(options, valueMap) {
        super();
        this.options = options;
        this.valueMap = valueMap;

        this.options.values = [
            'IS_ONE_OF',
            'IS_NOT_ONE_OF'].includes(this.options.matchOperator) ?
            [...this.options.variableValues] : null;

        if (!this.options.values) {
            this.options.values = [
                'IS',
                'IS_NOT',
                'IS_GREATER_THAN',
                'IS_LESS_THAN',
                'IS_GREATER_THAN_OR_EQUAL_TO',
                'IS_LESS_THAN_OR_EQUAL_TO'].includes(this.options.matchOperator) ?
                [this.options.variableExpression] : null;
        }

        if ([
            'IS_GREATER_THAN',
            'IS_LESS_THAN',
            'IS_GREATER_THAN_OR_EQUAL_TO',
            'IS_LESS_THAN_OR_EQUAL_TO',
            'IS_BETWEEN',
            'IS_NOT_BETWEEN'].includes(this.options.matchOperator)) {
            this.checkVar = 'getVarNumber("' + this.options.variableName + '")';

        } else {
            this.checkVar = 'getVar("' + this.options.variableName + '")';
        }
    }

    process() {
        if (this.options.matchOperator === 'IS_BETWEEN') {
            return ('(' + this.checkVar + ' > tonumber("' + this.options.lowerBound + '") and ' +
                this.checkVar + ' < tonumber("' + this.options.upperBound + '"))');

        } else if (this.options.matchOperator === 'IS_NOT_BETWEEN') {
            return ('(' + this.checkVar + ' < tonumber("' + this.options.lowerBound + '") or ' +
                this.checkVar + ' > tonumber("' + this.options.upperBound + '"))');

        } else {
            return super.process();
        }
    }

}
Criteria.register('matchVariable', CriteriaMatchVariable);
