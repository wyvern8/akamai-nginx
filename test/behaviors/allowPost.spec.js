import assert from 'assert';
import { describe, it } from 'mocha';
import {BehaviorAllowPost} from '../../src/behaviors/allowPost.js';
import { default as fs } from 'fs';

describe('BehaviorAllowPost', () => {
    describe('enabled', () => {
        it('should return expected lua', (done) => {
            fs.readFile(__dirname + '/allowPost.enabled.papi.json', 'utf8', (err, options) => {
                if (err) {
                    throw (err);
                }
                let opts = JSON.parse(options);

                let expected = 'aka_request_method_status["POST"] = "ALLOW"';
                let actual = new BehaviorAllowPost(opts).process();
                assert.equal(actual, expected);
                done();
            });
        });
    });

    describe('disabled', () => {
        it('should return expected lua', (done) => {
            fs.readFile(__dirname + '/allowPost.disabled.papi.json', 'utf8', (err, options) => {
                if (err) {
                    throw (err);
                }
                let opts = JSON.parse(options);

                let expected = 'aka_request_method_status["POST"] = "DENY"';
                let actual = new BehaviorAllowPost(opts).process();
                assert.equal(actual, expected);
                done();
            });
        });
    });

});