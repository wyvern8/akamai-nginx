import { default as assert } from 'assert';
import { describe, it } from 'mocha';
import { CriteriaQueryStringParameter } from '../../src/criteria/queryStringParameter.js';
import { default as fs } from 'fs';

describe('CriteriaQueryStringParameter', function() {
    describe('match one of', function () {
        it('should return expected lua', function (done) {
            fs.readFile(__dirname + '/queryStringParameter.papi.json', 'utf8', (err, options) => {
                if (err) {
                    throw (err);
                }
                let opts = JSON.parse(options);

                let expected = 'ngx.req.get_uri_args()["' + opts.parameterName + '"]' +
                    ' == swapVars("' + opts.values[0] + '") or ' +
                    'ngx.req.get_uri_args()["' + opts.parameterName + '"]' +
                    ' == swapVars("' + opts.values[1] + '")';

                let criteria = new CriteriaQueryStringParameter(opts);
                let actual = criteria.process();
                assert.equal(actual, expected);
                done();
            });
        });
    });

});