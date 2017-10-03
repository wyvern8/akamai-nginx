import { default as assert } from 'assert';
import { describe, it } from 'mocha';
import { CriteriaRequestProtocol } from '../../src/criteria/requestProtocol.js';
import { default as fs } from 'fs';

describe('CriteriaRequestProtocol', function() {
    describe('specific match', function () {
        it('should return expected lua', function (done) {
            fs.readFile(__dirname + '/requestProtocol.papi.json', 'utf8', (err, options) => {
                if (err) {
                    throw (err);
                }
                let opts = JSON.parse(options);

                let expected = 'ngx.var.scheme == "' + opts.value + '"';

                let criteria = new CriteriaRequestProtocol(opts);
                let actual = criteria.process();
                assert.equal(actual, expected);
                done();
            });
        });
    });

});