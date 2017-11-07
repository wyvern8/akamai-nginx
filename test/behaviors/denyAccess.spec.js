import assert from 'assert';
import { describe, it } from 'mocha';
import {BehaviorDenyAccess} from '../../src/behaviors/denyAccess.js';
import { default as fs } from 'fs';

describe('BehaviorDenyAccess', () => {
    describe('deny enabled', () => {
        it('should return expected lua', (done) => {
            fs.readFile(__dirname + '/denyAccess.enabled.papi.json', 'utf8', (err, options) => {
                if (err) {
                    throw (err);
                }
                let opts = JSON.parse(options);

                let expected = 'ngx.var.aka_deny_reason = "' + opts.reason + '"';
                let actual = new BehaviorDenyAccess(opts).process();
                assert.equal(actual, expected);
                done();
            });
        });
    });

    describe('deny disabled', () => {
        it('should return expected lua', (done) => {
            fs.readFile(__dirname + '/denyAccess.disabled.papi.json', 'utf8', (err, options) => {
                if (err) {
                    throw (err);
                }
                let opts = JSON.parse(options);

                let expected = [
                    '-- denyAccess disabled: ' + opts.reason,
                    'ngx.var.aka_deny_reason = ""'
                ];
                let actual = new BehaviorDenyAccess(opts).process();
                assert.equal(actual[0], expected[0]);
                assert.equal(actual[1], expected[1]);
                done();
            });
        });
    });

});