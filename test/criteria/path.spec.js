import { default as assert } from 'assert';
import { describe, it } from 'mocha';
import { CriteriaPath } from '../../src/criteria/path.js';
import { default as fs } from 'fs';

describe('CriteriaPath', function() {
    describe('match any', function () {
        it('should return expected lua', function (done) {
            fs.readFile(__dirname + '/path.is.papi.json', 'utf8', (err, options) => {
                if (err) {
                    throw (err);
                }
                let opts = JSON.parse(options);

                let expected = 'matches(aka_request_path, swapVars("' + opts.values[0] +
                    '*")) or matches(aka_request_path, swapVars("' + opts.values[1] +
                    '*")) or matches(aka_request_path, swapVars("' + opts.values[2] + '*"))';

                let criteria = new CriteriaPath(opts);
                let actual = criteria.process(true, '*');
                assert.equal(actual, expected);
                done();
            });
        });
    });

});