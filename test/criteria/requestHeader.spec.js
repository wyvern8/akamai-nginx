import { default as assert } from 'assert';
import { describe, it } from 'mocha';
import { CriteriaRequestHeader } from '../../src/criteria/requestHeader.js';
import { default as fs } from 'fs';

describe('CriteriaRequestHeader', function() {
    describe('match one of', function () {
        it('should return expected lua', function (done) {
            fs.readFile(__dirname + '/requestHeader.papi.json', 'utf8', (err, options) => {
                if (err) {
                    throw (err);
                }
                let opts = JSON.parse(options);

                let expected = 'ngx.req.get_headers()["' + opts.headerName + '"]' +
                    ' == swapVars("' + opts.values[0] + '") or ' +
                    'ngx.req.get_headers()["' + opts.headerName + '"]' +
                    ' == swapVars("' + opts.values[1] + '")';

                let criteria = new CriteriaRequestHeader(opts);
                let actual = criteria.process();
                assert.equal(actual, expected);
                done();
            });
        });
    });

});