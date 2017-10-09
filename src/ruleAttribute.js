
export class RuleAttribute {

    constructor() {
        return this;
    }

    static get valueMap() {
        return this._valueMap;
    }

    static set valueMap(valueMap) {
        this._valueMap = valueMap;
    }

    static switchByVal(cases, defaultCase, key) {
        return key in cases ? cases[key] : defaultCase;
    }

    process() {
        // override
    }

    value(value) {
        if (this.valueMap && this.valueMap.has(value)) {
            let replacement = this.valueMap.get(value);
            console.debug('replacing "' + value + '" with "' + replacement + '"');
            return '"' + replacement + '"';
        } else {
            return '"' + value + '"';
        }
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
        return this.registeredTypes.has(clazzname);
    }

    static register(clazzname, clazz) {
        if (!(this.isRegistered(clazzname) &&
            clazz.prototype instanceof this)) {
            this.registeredTypes.set(clazzname, clazz);
            console.info(this.name + ' registered: ' + clazzname);
        } else {
            console.log('invalid type. must be a subclass of ' + this.name);
        }
    }

    static create(clazzname, ...options) {
        if (!clazzname) return null;
        if (!this.registeredTypes.has(clazzname)) {
            console.error(this.name + ' not registered: ' + clazzname);
            return null;
        }

        let clazz = this.registeredTypes.get(clazzname);
        let instance = new clazz(...options);
        return instance;
    }

}
