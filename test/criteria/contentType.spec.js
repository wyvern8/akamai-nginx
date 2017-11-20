import { default as assert } from 'assert';
import { describe, it } from 'mocha';
import { CriteriaContentType } from '../../src/criteria/contentType.js';
import { default as fs } from 'fs';

describe('CriteriaContentType', function() {
    describe('match any', function () {
        it('should return expected lua', function (done) {
            fs.readFile(__dirname + '/contentType.papi.json', 'utf8', (err, options) => {
                if (err) {
                    throw (err);
                }
                let opts = JSON.parse(options);

                let expected = 'matches(ngx.header["Content-Type"], swapVars("' + opts.values[0] +
                    '")) or matches(ngx.header["Content-Type"], swapVars("' + opts.values[1] + '"))';

                let criteria = new CriteriaContentType(opts);
                let actual = criteria.process(true, '*');
                assert.equal(actual, expected);
                done();
            });
        });
    });

});