import { default as assert } from 'assert';
import { describe, it } from 'mocha';
import { CriteriaRequestMethod } from '../../src/criteria/requestMethod.js';
import { default as fs } from 'fs';

describe('CriteriaRequestMethod', function() {
    describe('check is method', function () {
        it('should return expected lua', function (done) {
            fs.readFile(__dirname + '/requestMethod.is.papi.json', 'utf8', (err, options) => {
                if (err) {
                    throw (err);
                }
                let opts = JSON.parse(options);

                let expected = 'ngx.req.get_method() == "' + opts.value + '"';

                let criteria = new CriteriaRequestMethod(opts);
                let actual = criteria.process();
                assert.equal(actual, expected);
                done();
            });
        });
    });
    describe('check is not method', function () {
        it('should return expected lua', function (done) {
            fs.readFile(__dirname + '/requestMethod.not.papi.json', 'utf8', (err, options) => {
                if (err) {
                    throw (err);
                }
                let opts = JSON.parse(options);

                let expected = 'ngx.req.get_method() ~= "' + opts.value + '"';
                let criteria = new CriteriaRequestMethod(opts);
                let actual = criteria.process();
                assert.equal(actual, expected);
                done();
            });
        });
    });
});