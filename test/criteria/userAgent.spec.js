import { default as assert } from 'assert';
import { describe, it } from 'mocha';
import { CriteriaUserAgent } from '../../src/criteria/userAgent.js';
import { default as fs } from 'fs';

describe('CriteriaUserAgent', function() {
    describe('match one of', function () {
        it('should return expected lua', function (done) {
            fs.readFile(__dirname + '/userAgent.papi.json', 'utf8', (err, options) => {
                if (err) {
                    throw (err);
                }
                let opts = JSON.parse(options);

                let expected = 'matches(ngx.req.get_headers()["user-agent"], ' +
                    '"' + opts.values[0] + '")';

                let criteria = new CriteriaUserAgent(opts);
                let actual = criteria.process();
                assert.equal(actual, expected);
                done();
            });
        });
    });

});