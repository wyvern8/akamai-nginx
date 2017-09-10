import { default as requireDir } from 'require-dir';

export class Behavior {

    static valueMap;

    constructor(name, options, valueMap) {
        return Behavior.create(name, options, valueMap);
    }

    process() {
        // override
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

    static registeredTypes = new Map();
    static skipTypes = new Map();

    static isRegistered(clazzname) {
        return Behavior.registeredTypes.has(clazzname);
    }

    static register(clazzname, clazz) {
        if (!(Behavior.isRegistered(clazzname) &&
            clazz.prototype instanceof Behavior)) {
            Behavior.registeredTypes.set(clazzname, clazz);
        } else {
            console.log('invalid type. must be a subclass of Behavior');
        }
    };

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