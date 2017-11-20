import { default as assert } from 'assert';
import { describe, it } from 'mocha';
import { CriteriaMatchVariable } from '../../src/criteria/matchVariable.js';
import { default as fs } from 'fs';

describe('CriteriaMatchVariable', function() {
    describe('exact match', function () {
        it('should return expected lua', function (done) {
            fs.readFile(__dirname + '/matchVariable.match.papi.json', 'utf8', (err, options) => {
                if (err) {
                    throw (err);
                }
                let opts = JSON.parse(options);

                let expected = 'getVar("' + opts.variableName + '") == swapVars("' + opts.variableExpression + '")';

                let criteria = new CriteriaMatchVariable(opts);
                let actual = criteria.process(true);
                assert.equal(actual, expected);
                done();
            });
        });
    });
    describe('match one of', function () {
        it('should return expected lua', function (done) {
            fs.readFile(__dirname + '/matchVariable.oneOf.papi.json', 'utf8', (err, options) => {
                if (err) {
                    throw (err);
                }
                let opts = JSON.parse(options);

                let expected = 'matches(getVar("' + opts.variableName + '"), swapVars("' + opts.variableValues[0] + '"))' +
                    ' or matches(getVar("' + opts.variableName + '"), swapVars("' + opts.variableValues[1] + '"))';

                let criteria = new CriteriaMatchVariable(opts);
                let actual = criteria.process(true);
                assert.equal(actual, expected);
                done();
            });
        });
    });
    describe('number between', function () {
        it('should return expected lua', function (done) {
            fs.readFile(__dirname + '/matchVariable.between.papi.json', 'utf8', (err, options) => {
                if (err) {
                    throw (err);
                }
                let opts = JSON.parse(options);

                let expected = '(getVarNumber("' + opts.variableName + '") > tonumber("' + opts.lowerBound + '")' +
                    ' and getVarNumber("' + opts.variableName + '") < tonumber("' + opts.upperBound + '"))';

                let criteria = new CriteriaMatchVariable(opts);
                let actual = criteria.process(true);
                assert.equal(actual, expected);
                done();
            });
        });
    });
});