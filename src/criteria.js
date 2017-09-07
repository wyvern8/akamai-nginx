import requireDir from 'require-dir';

export class Criteria {

    static valueMap;

    constructor(name, options) {
        return Criteria.create(name, options);
    }

    checkVar;

    process(usePattern) {
        if (this.options && this.options.values) {
            let valueArray = [];
            this.options.values.forEach((val) => {
                if (usePattern) {
                    valueArray.push('matches(' + this.checkVar + ',' + this.value(val) + ')');
                } else {
                    valueArray.push(this.checkVar + this.matchOperatorCompare(val) + this.value(val));
                }
            });
            return valueArray.join(this.matchOperatorJoiner());

        } else if (this.options && this.options.value) {
            return this.checkVar + this.matchOperatorCompare(this.options.value) + this.value(this.options.value);
        }
    }

    value(value) {
        if (value === '*') return '';
        if (this.valueMap && this.valueMap.has(value)) {
            let replacement = this.valueMap.get(value);
            console.debug('replacing "' + value + '" with "' + replacement + '"');
            return ' "' + replacement + '"';
        } else {
            return ' "' + value + '"';
        }
    }

    matchOperatorJoiner() {
        switch (this.options.matchOperator) {
            case 'IS_ONE_OF': {
                return ' or ';
            }
            default : {
                return ' and '
            }
        }
    }

    matchOperatorCompare(value) {
        if (value === '*') return '';
        switch (this.options.matchOperator) {
            case 'IS_ONE_OF': {
                return ' ==';
            }
            default : {
                return ' =='
            }
        }
    }

    static registeredTypes = new Map();

    static isRegistered(clazzname) {
        return Criteria.registeredTypes.has(clazzname);
    }

    static register(clazzname, clazz) {
        if (!(Criteria.isRegistered(clazzname) &&
            clazz.prototype instanceof Criteria)) {
            Criteria.registeredTypes.set(clazzname, clazz);
        } else {
            console.log('invalid type. must be a subclass of Criteria');
        }
    };

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