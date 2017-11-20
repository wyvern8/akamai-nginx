import assert from 'assert';
import { describe, it } from 'mocha';
import { BehaviorModifyOutgoingResponseHeader } from '../../src/behaviors/modifyOutgoingResponseHeader.js';
import { default as fs } from 'fs';

describe('BehaviorModifyOutgoingResponseHeader', () => {
    describe('other header', () => {
        it('should return expected lua', (done) => {
            fs.readFile(__dirname + '/modifyOutgoingResponseHeader.papi.json', 'utf8', (err, options) => {
                if (err) {
                    throw (err);
                }
                let opts = JSON.parse(options);

                let expected = [
                    '-- ' + opts.action + ' CAPTURE response header to client',
                    'aka_downstream_headers["' + opts.customHeaderName + '"] = ' +
                        '{ "MODIFY", swapVars("max-age=31536000"), swapVars("undefined"), swapVars("undefined") }'
                ];

                let actual = new BehaviorModifyOutgoingResponseHeader(opts).process();

                assert.equal(actual[0], expected[0]);
                assert.equal(actual[1], expected[1]);
                done();
            });
        });
    });

});