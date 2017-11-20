import { default as assert } from 'assert';
import { describe, it } from 'mocha';
import { Criteria } from '../src/criteria.js';
import { default as fs } from 'fs';

describe('Criteria', function() {
    describe('process', function () {
        describe('match multiple patterns', function () {
            it('should return expected lua', function (done) {
                fs.readFile(__dirname + '/criteria.multi.papi.json', 'utf8', (err, options) => {
                    if (err) {
                        throw (err);
                    }
                    let opts = JSON.parse(options);

                    let expected = 'matches(ngx.test, swapVars("' + opts.values[0] +
                        '")) or matches(ngx.test, swapVars("' + opts.values[1] + '"))';

                    Criteria.register('testCriteria', Criteria);
                    let criteria = Criteria.create('testCriteria', opts);
                    criteria.checkVar = 'ngx.test';
                    criteria.options = opts;
                    let actual = criteria.process();
                    assert.equal(actual, expected);
                    done();
                });
            });
        });
        describe('not equal single value', function () {
            it('should return expected lua', function (done) {
                fs.readFile(__dirname + '/criteria.single.papi.json', 'utf8', (err, options) => {
                    if (err) {
                        throw (err);
                    }
                    let opts = JSON.parse(options);

                    let expected = 'ngx.test ~= swapVars("' + opts.value + '")';

                    Criteria.register('testCriteria', Criteria);
                    let criteria = Criteria.create('testCriteria', opts);
                    criteria.checkVar = 'ngx.test';
                    criteria.options = opts;
                    let actual = criteria.process();
                    assert.equal(actual, expected);
                    done();
                });
            });
        });
    });

});