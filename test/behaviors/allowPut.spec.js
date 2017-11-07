import assert from 'assert';
import { describe, it } from 'mocha';
import {BehaviorAllowPut} from '../../src/behaviors/allowPut.js';
import { default as fs } from 'fs';

describe('BehaviorAllowPut', () => {
    describe('enabled', () => {
        it('should return expected lua', (done) => {
            fs.readFile(__dirname + '/allowPut.enabled.papi.json', 'utf8', (err, options) => {
                if (err) {
                    throw (err);
                }
                let opts = JSON.parse(options);

                let expected = 'aka_request_method_status["PUT"] = "ALLOW"';
                let actual = new BehaviorAllowPut(opts).process();
                assert.equal(actual, expected);
                done();
            });
        });
    });

    describe('disabled', () => {
        it('should return expected lua', (done) => {
            fs.readFile(__dirname + '/allowPut.disabled.papi.json', 'utf8', (err, options) => {
                if (err) {
                    throw (err);
                }
                let opts = JSON.parse(options);

                let expected = 'aka_request_method_status["PUT"] = "DENY"';
                let actual = new BehaviorAllowPut(opts).process();
                assert.equal(actual, expected);
                done();
            });
        });
    });

});