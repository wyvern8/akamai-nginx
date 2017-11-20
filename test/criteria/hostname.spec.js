import { default as assert } from 'assert';
import { describe, it } from 'mocha';
import { CriteriaHostname } from '../../src/criteria/hostname.js';
import { default as fs } from 'fs';

describe('CriteriaHostname', function() {
    describe('match exact', function () {
        it('should return expected lua', function (done) {
            fs.readFile(__dirname + '/hostname.exact.papi.json', 'utf8', (err, options) => {
                if (err) {
                    throw (err);
                }
                let opts = JSON.parse(options);

                let expected = 'ngx.var.host == swapVars("' + opts.values[0] +
                    '") or ngx.var.host == swapVars("' + opts.values[1] +
                    '") or ngx.var.host == swapVars("' + opts.values[2] + '")';

                let criteria = new CriteriaHostname(opts);
                let actual = criteria.process();
                assert.equal(actual, expected);
                done();
            });
        });
    });

    describe('match pattern', function () {
        it('should return expected lua', function (done) {
            fs.readFile(__dirname + '/hostname.pattern.papi.json', 'utf8', (err, options) => {
                if (err) {
                    throw (err);
                }
                let opts = JSON.parse(options);

                let expected = 'matches(ngx.var.host, swapVars("' + opts.values[0] +
                    '")) or matches(ngx.var.host, swapVars("' + opts.values[1] +
                    '")) or matches(ngx.var.host, swapVars("' + opts.values[2] + '"))';

                let criteria = new CriteriaHostname(opts);
                let actual = criteria.process();
                assert.equal(actual, expected);
                done();
            });
        });
    });

});