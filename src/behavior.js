import { default as requireDir } from 'require-dir';

export class Behavior {

    constructor(name, options, valueMap) {
        return Behavior.create(name, options, valueMap);
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

    processHeaderOptions(luaMapName, comment) {
        let headerName = this.switchByVal({
            'MODIFY': '"' + (this.options.standardModifyHeaderName === 'OTHER' ?
                this.options.customHeaderName : this.options.standardModifyHeaderName) + '"',

            'ADD': '"' + (this.options.standardAddHeaderName === 'OTHER' ?
                this.options.customHeaderName : this.options.standardAddHeaderName) + '"',

            'REMOVE': '"' + (this.options.standardRemoveHeaderName === 'OTHER' ?
                this.options.customHeaderName : this.options.standardRemoveHeaderName) + '"',

        }, this.options.customHeaderName, this.options.action);


        let headerValue = this.switchByVal({
            'MODIFY': '"' + this.value(this.options.newHeaderValue) + '"',
            'ADD': '"' + this.value(this.options.headerValue) + '"',
            'REMOVE': 'nil'
        }, '', this.options.action);

        return [
            '-- ' + this.options.action + ' ' + comment,
            luaMapName + '[' + headerName + '] = ' + headerValue
        ];
    }

    value(value) {
        if (this.valueMap && this.valueMap.has(value)) {
            let replacement = this.valueMap.get(value);
            console.debug('replacing "' + value + '" with "' + replacement + '"');
            return replacement;
        } else {
            return value;
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
        return Behavior.registeredTypes.has(clazzname);
    }

    static register(clazzname, clazz) {
        if (!(Behavior.isRegistered(clazzname) &&
            clazz.prototype instanceof Behavior)) {
            Behavior.registeredTypes.set(clazzname, clazz);
            console.info('Behavior registered: ' + clazzname);
        } else {
            console.log('invalid type. must be a subclass of Behavior');
        }
    }

    static create(clazzname, ...options) {
        if (!clazzname) return null;
        if (!Behavior.registeredTypes.has(clazzname)) {
            console.error('Behavior not registered: ' + clazzname);
            return null;
        }

        let clazz = Behavior.registeredTypes.get(clazzname);
        let instance = new clazz(...options);
        return instance;
    }

}

requireDir('./behaviors');