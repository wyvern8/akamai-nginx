import assert from 'assert';
import { describe, it } from 'mocha';
import { BehaviorCpCode } from '../../src/behaviors/cpCode.js';
import { default as fs } from 'fs';

describe('BehaviorCpCode', () => {
    describe('cpCode header', () => {
        it('should return expected lua', (done) => {
            fs.readFile(__dirname + '/cpCode.papi.json', 'utf8', (err, options) => {
                if (err) {
                    throw (err);
                }
                let opts = JSON.parse(options);

                let expected = 'aka_downstream_headers["X-AKA-cpCode"] = {"SET", "' +
                    opts.value.id + '_' + opts.value.name.replace(' ', '_') + '"}';

                let actual = new BehaviorCpCode(opts).process();
                assert.equal(actual, expected);
                done();
            });
        });
    });

});