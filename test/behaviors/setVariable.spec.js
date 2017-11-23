import { default as assert } from 'assert';
import { describe, it } from 'mocha';
import { BehaviorSetVariable } from '../../src/behaviors/setVariable.js';
import { default as fs } from 'fs';

describe('BehaviorSetVariable', function() {
    describe('expression', function () {
        it('should return expected lua', function (done) {
            fs.readFile(__dirname + '/setVariable.expression.papi.json', 'utf8', (err, options) => {
                if (err) {
                    throw (err);
                }

                let opts = JSON.parse(options);
                let expected = [
                    'varMap["PMUSER_TEST_1"] = function()',
                    '\tlocal function setVar()',
                    '\t\tlocal result',
                    '\t\t-- EXPRESSION',
                    '\t\tresult = swapVars("hostname is {{builtin.AK_HOST}}")',
                    '\t\treturn result',
                    '\tend',
                    '\treturn setVar()',
                    'end'
                ];

                let behavior = new BehaviorSetVariable(opts);
                let actual = behavior.process();

                assert.equal(actual.join('\n'), expected.join('\n'));
                done();
            });

        });
    });

    describe('generate', function () {
        it('should return expected lua', function (done) {
            fs.readFile(__dirname + '/setVariable.generate.papi.json', 'utf8', (err, options) => {
                if (err) {
                    throw (err);
                }

                let opts = JSON.parse(options);
                let expected = [
                    'varMap["PMUSER_TEST_1"] = function()',
                    '\tlocal function setVar()',
                    '\t\tlocal result',
                    '\t\t-- GENERATE: ' + opts.generator,
                    '\t\tmath.randomseed(os.time())',
                    '\t\tresult = math.random(' + opts.minRandomNumber + ', ' + opts.maxRandomNumber + ')',
                    '\t\treturn result',
                    '\tend',
                    '\treturn setVar()',
                    'end'
                ];

                let behavior = new BehaviorSetVariable(opts);
                let actual = behavior.process();

                assert.equal(actual.join('\n'), expected.join('\n'));
                done();
            });

        });
    });

    describe('extract', function () {
        it('should return expected lua', function (done) {
            fs.readFile(__dirname + '/setVariable.extract-qs-upper.papi.json', 'utf8', (err, options) => {
                if (err) {
                    throw (err);
                }

                let opts = JSON.parse(options);
                let expected = [
                    'varMap["PMUSER_TEST_1"] = function()',
                    '\tlocal function setVar()',
                    '\t\tlocal result',
                    '\t\t-- EXTRACT: ' + opts.extractLocation,
                    '\t\tresult = cs(ngx.req.get_uri_args()["' + opts.queryParameterName + '"])',
                    '\t\t-- TRANSFORM: ' + opts.transform,
                    '\t\tlocal options = { }',
                    '\t\toptions["variableName"] = "'+ opts.variableName + '"',
                    '\t\toptions["valueSource"] = "'+ opts.valueSource + '"',
                    '\t\toptions["transform"] = "'+ opts.transform + '"',
                    '\t\toptions["extractLocation"] = "' + opts.extractLocation + '"',
                    '\t\toptions["queryParameterName"] = "' + opts.queryParameterName + '"',
                    '\t\treturn transformVariable(result, options)',
                    '\tend',
                    '\treturn setVar()',
                    'end'
                ];

                let behavior = new BehaviorSetVariable(opts);
                let actual = behavior.process();

                assert.equal(actual.join('\n'), expected.join('\n'));
                done();
            });

        });
    });

});