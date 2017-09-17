import assert from 'assert';
import { BehaviorCaching } from '../../src/behaviors/caching.js';

let optionsMaxAgeCacheTTL = {
    "behavior" : "MAX_AGE",
    "mustRevalidate" : false,
    "ttl" : "2h"
};

describe('BehaviorCaching', () => {
    describe('max age ttl', () => {
        it('should return expected lua', () => {
            let expected = 'ngx.header["x-aka-' + optionsMaxAgeCacheTTL.behavior + '"] = "' +
                optionsMaxAgeCacheTTL.ttl + '"';

            let actual = new BehaviorCaching(optionsMaxAgeCacheTTL).process();
            assert.equal(actual, expected);
        });
    });

});