import requireDir from 'require-dir';

export class Criteria {

    constructor(name, options, valueMap) {
        return Criteria.create(name, options, valueMap);
    }

    static get valueMap() {
        return this._valueMap;
    }

    static set valueMap(valueMap) {
        this._valueMap = valueMap;
    }

    static get checkVar() {
        return this._checkVar;
    }

    static set checkVar(checkVar) {
        this._checkVar = checkVar;
    }

    process(usePattern, valueSuffix) {
        if (this.options && this.options.values) {
            let valueArray = [];
            this.options.values.forEach((val) => {
                if (valueSuffix) val = val + valueSuffix;
                if (usePattern || val.indexOf('*') > 0) {
                    valueArray.push('matches(' + this.checkVar + ',' + this.value(val) + ')');
                } else {
                    valueArray.push(this.checkVar + this.matchOperatorCompare() + this.value(val));
                }
            });
            return valueArray.join(this.matchOperatorJoiner());

        } else if (this.options && this.options.value) {
            let val = this.options.value;
            if (valueSuffix) val = val + valueSuffix;
            if (usePattern || val.indexOf('*') > 0) {
                return 'matches(' + this.checkVar + ',' + this.value(val) + ')';
            } else {
                return this.checkVar + this.matchOperatorCompare() + this.value(val);
            }
        }
    }

    value(value) {
        if (this.valueMap && this.valueMap.has(value)) {
            let replacement = this.valueMap.get(value);
            console.debug('replacing "' + value + '" with "' + replacement + '"');
            return ' "' + replacement + '"';
        } else {
            return ' "' + value + '"';
        }
    }

    switchByVal(cases, defaultCase, key) {
        return key in cases ? cases[key] : defaultCase;
    }

    matchOperatorJoiner() {
        return this.switchByVal({
            'MATCHES_ONE_OF': ' or ',
            'IS_ONE_OF': ' or ',
            'IS_NOT_ONE_OF': ' and '
        }, ' and ', this.options.matchOperator);
    }

    matchOperatorCompare() {
        return this.switchByVal({
            'IS_ONE_OF': ' ==',
            'IS_NOT': ' ~=',
            'IS_NOT_ONE_OF': ' ~='
        }, ' ==', this.options.matchOperator);


    }

    static get registeredTypes() {
        if (this.hasOwnProperty('_registeredTypeMap')) {
            return this._registeredTypeMap;
        } else {
            this._registeredTypeMap = new Map();
            return this._registeredTypeMap;
        }
    }

    static isRegistered(clazzname) {
        return Criteria.registeredTypes.has(clazzname);
    }

    static register(clazzname, clazz) {
        if (!(Criteria.isRegistered(clazzname) &&
            clazz.prototype instanceof Criteria)) {
            Criteria.registeredTypes.set(clazzname, clazz);
            console.info('Criteria registered: ' + clazzname);
        } else {
            console.log('invalid type. must be a subclass of Criteria');
        }
    }

    static create(clazzname, ...options) {
        if (!clazzname) return null;
        if (!Criteria.registeredTypes.has(clazzname)) {
            console.error('Criteria not registered: ' + clazzname);
            return null;
        }
        let clazz = Criteria.registeredTypes.get(clazzname);
        let instance = new clazz(...options);
        return instance;
    }

}

requireDir('./criteria');