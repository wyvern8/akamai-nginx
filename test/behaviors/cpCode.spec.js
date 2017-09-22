import assert from 'assert';
import { BehaviorCpCode } from '../../src/behaviors/cpCode.js';

let optionsCpCode = {
    "value": {
        "id": 888888,
        "description": "CP2 akamai.com",
        "products": ["Alta"],
        "createdDate": 1493347578000,
        "name": "CP2 akamai.com"
    }
}

describe('BehaviorCpCode', () => {
    describe('cpCode header', () => {
        it('should return expected lua', () => {
            let expected = 'ngx.header["x-aka-cpCode"] = "' +
                optionsCpCode.value.id + '_' + optionsCpCode.value.name.replace(' ', '_') + '"';

            let actual = new BehaviorCpCode(optionsCpCode).process();
            assert.equal(actual, expected);
        });
    });

});