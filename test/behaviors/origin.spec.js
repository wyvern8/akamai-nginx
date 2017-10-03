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
                let expected = 'ngx.var.aka_origin_host = "' + opts.hostname + '"';
                let actual = new BehaviorOrigin(opts).process();
                assert.equal(actual, expected);
                done();
            });
        });
    });

});