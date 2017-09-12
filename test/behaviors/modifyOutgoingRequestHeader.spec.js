import { default as assert } from 'assert';
import { BehaviorModifyOutgoingRequestHeader } from '../../src/behaviors/modifyOutgoingRequestHeader.js';
import { default as fs } from 'fs';

describe('BehaviorModifyOutgoingRequestHeader', function() {
    describe('add or modify outgoing upstream header', function () {
        it('should return expected lua', function (done) {
            fs.readFile(__dirname + '/modifyOutgoingRequestHeader.modify.papi.json', 'utf8', (err, options) => {
                if (err) {
                    throw (err);
                }

                let opts = JSON.parse(options);
                let expected = [
                    '-- ' + opts.action + ' header',
                    'aka_upstream_headers["' + opts.customHeaderName + '"] = "' + opts.newHeaderValue + '"'
                ];

                let behavior = new BehaviorModifyOutgoingRequestHeader(opts);
                let actual = behavior.process();

                assert.equal(actual[0], expected[0]);
                assert.equal(actual[1], expected[1]);
                done();
            });

        });
    });

});