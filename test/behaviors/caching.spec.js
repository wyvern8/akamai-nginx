import assert from 'assert';
import { describe, it } from 'mocha';
import { BehaviorCaching } from '../../src/behaviors/caching.js';
import { default as fs } from 'fs';

describe('BehaviorCaching', () => {
    describe('max age ttl', () => {
        it('should return expected lua', (done) => {
            fs.readFile(__dirname + '/caching.papi.json', 'utf8', (err, options) => {
                if (err) {
                    throw (err);
                }
                let opts = JSON.parse(options);

                let expected = 'ngx.header["x-aka-' + opts.behavior + '"] = "' +
                    opts.ttl + '"';

                let actual = new BehaviorCaching(opts).process();
                assert.equal(actual, expected);
                done();
            });
        });
    });

});