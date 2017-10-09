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

        } else if (this.options && this.options.values) {
            let valueArray = [];
            this.options.values.forEach((val) => {
                if (valueSuffix) val = val + valueSuffix;
                if (usePattern || val.indexOf('*') > -1) {
                    valueArray.push('matches(' + this.checkVar + ', ' + this.value(val) + ')');
                } else {
                    valueArray.push(this.checkVar + this.matchOperatorCompare() + this.value(val));
                }
            });
            return valueArray.join(this.matchOperatorJoiner());

        } else if (this.options && this.options.value) {
            let val = this.options.value;
            if (valueSuffix) val = val + valueSuffix;
            if (usePattern || val.indexOf('*') > -1) {
                return 'matches(' + this.checkVar + ', ' + this.value(val) + ')';
            } else {
                return this.checkVar + this.matchOperatorCompare() + this.value(val);
            }
        }
    }

    matchOperatorJoiner() {
        return RuleAttribute.switchByVal({
            'MATCHES_ONE_OF': ' or ',
            'IS_ONE_OF': ' or ',
            'IS_NOT_ONE_OF': ' and '
        }, ' and ', this.options.matchOperator);
    }

    matchOperatorCompare() {
        return RuleAttribute.switchByVal({
            'EXISTS': ' ~= ',
            'DOES_NOT_EXIST': ' == ',
            'IS_ONE_OF': ' == ',
            'IS_NOT': ' ~= ',
            'IS_NOT_ONE_OF': ' ~= '
        }, ' == ', this.options.matchOperator);
    }

}

requireDir('./criteria');