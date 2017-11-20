import assert from 'assert';
import { describe, it } from 'mocha';
import {BehaviorOrigin} from '../../src/behaviors/origin.js';
import fs from 'fs';

describe('BehaviorOrigin', () => {
    describe('customer origin', () => {
        it('should return expected lua', (done) => {
            fs.readFile(__dirname + '/origin.papi.json', 'utf8', (err, options) => {
                if (err) {
                    throw (err);
                }
                let opts = JSON.parse(options);
                let expected = [
                    'ngx.var.aka_origin_host = swapVars("' + opts.hostname + '")',
                    'ngx.var.aka_origin_host_header = mapValue(aka_request_host)',
                    'aka_upstream_headers["True-Client-IP"] = ngx.req.get_headers()["True-Client-IP"]'
                ];
                let actual = new BehaviorOrigin(opts).process();
                assert.equal(actual[0], expected[0]);
                assert.equal(actual[1], expected[1]);
                assert.equal(actual[2], expected[2]);
                done();
            });
        });
    });

});