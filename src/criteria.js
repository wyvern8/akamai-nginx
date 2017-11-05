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

    process(usePattern, valueSuffix) {
        if (this.options.matchOperator === 'EXISTS') {
            return this.checkVar + this.matchOperatorCompare() + 'nil';

        } else if (this.options.matchOperator === 'DOES_NOT_EXIST') {
            return this.checkVar + this.matchOperatorCompare() + 'nil';

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
                    let negate = (this.options.matchOperator === 'DOES_NOT_MATCH_ONE_OF' ||
                        this.options.matchOperator === 'IS_NOT_ONE_OF') ? 'not ' : '';
                    conditionArray.push(negate + 'matches(' + this.checkVar + ', ' + this.value(val) + ')');
                } else {
                    conditionArray.push(this.checkVar + this.matchOperatorCompare() + this.value(val));
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
            'IS_ONE_OF': ' == ',
            'IS_NOT': ' ~= ',
            'IS_NOT_ONE_OF': ' ~= '
        }, ' == ', this.options.matchOperator);
    }

}

requireDir('./criteria');