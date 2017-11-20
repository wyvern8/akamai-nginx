import requireDir from 'require-dir';
import { RuleAttribute } from './ruleAttribute.js';

export class Criteria extends RuleAttribute {

    constructor(name, options, valueMap) {
        super();
        return Criteria.create(name, options, valueMap);
    }

    static get checkVar() {
        return this._checkVar;
    }

    static set checkVar(checkVar) {
        this._checkVar = checkVar;
    }

    /**
     * process criteria options into lua expression
     * @param usePattern
     * @param valueSuffix
     * @returns {string}
     */
    process(usePattern, valueSuffix) {

        if (['EXISTS', 'IS_NOT_EMPTY', 'DOES_NOT_EXIST', 'IS_EMPTY'].includes(this.options.matchOperator)) {

            return this.checkVar + this.matchOperatorCompare() + 'nil' +
                ' or ' + this.checkVar + this.matchOperatorCompare() + '""';

        } else {

            let conditionArray = [];
            let valueArray = [];

            if (this.options.value) {
                valueArray = [this.options.value];
            } else if (this.options.values) {
                valueArray = [...this.options.values];
            }

            valueArray.forEach((val) => {

                if (valueSuffix) val = val + valueSuffix;

                if (usePattern || this.options.matchWildcard === true || val.indexOf('*') > -1) {

                    let negate = (['DOES_NOT_MATCH_ONE_OF', 'IS_NOT', 'IS_NOT_ONE_OF']
                        .includes(this.options.matchOperator)) ? 'not ' : '';

                    conditionArray.push(negate + 'matches(' + this.checkVar + ', ' + this.value(val) + ')');

                } else {

                    if (this.useNumericComparison()) {
                        conditionArray.push(this.checkVar +
                            this.matchOperatorCompare() + 'tonumber(' + this.value(val) + ')');

                    } else {
                        conditionArray.push(this.checkVar + this.matchOperatorCompare() + this.value(val));

                    }
                }

            });

            return conditionArray.join(this.matchOperatorJoiner());

        }
    }

    matchOperatorJoiner() {
        return this.switchByVal({
            'MATCHES_ONE_OF': ' or ',
            'IS_ONE_OF': ' or ',
            'IS_NOT_ONE_OF': ' and ',
            'DOES_NOT_MATCH_ONE_OF': ' and '
        }, ' and ', this.options.matchOperator);
    }

    matchOperatorCompare() {
        return this.switchByVal({
            'EXISTS': ' ~= ',
            'DOES_NOT_EXIST': ' == ',
            'IS': ' == ',
            'IS_ONE_OF': ' == ',
            'IS_NOT': ' ~= ',
            'IS_NOT_ONE_OF': ' ~= ',
            'IS_GREATER_THAN': ' > ',
            'IS_LESS_THAN': ' < ',
            'IS_GREATER_THAN_OR_EQUAL_TO': ' >= ',
            'IS_LESS_THAN_OR_EQUAL_TO': ' <= '
        }, ' == ', this.options.matchOperator);
    }

    useNumericComparison() {
        return (['IS_GREATER_THAN',
            'IS_LESS_THAN',
            'IS_GREATER_THAN_OR_EQUAL_TO',
            'IS_LESS_THAN_OR_EQUAL_TO'
        ].includes(this.options.matchOperator));
    }

}

requireDir('./criteria');