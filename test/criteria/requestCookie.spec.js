import { default as assert } from 'assert';
import { describe, it } from 'mocha';
import { CriteriaRequestCookie } from '../../src/criteria/requestCookie.js';
import { default as fs } from 'fs';

describe('CriteriaRequestCookie', function() {
    describe('specific match', function () {
        it('should return expected lua', function (done) {
            fs.readFile(__dirname + '/requestCookie.papi.json', 'utf8', (err, options) => {
                if (err) {
                    throw (err);
                }
                let opts = JSON.parse(options);

                let expected = 'ngx.var["cookie_' + opts.cookieName + '"] ' +
                    '== "' + opts.value + '"';

                let criteria = new CriteriaRequestCookie(opts);
                let actual = criteria.process();
                assert.equal(actual, expected);
                done();
            });
        });
    });

});