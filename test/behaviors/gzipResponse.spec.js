import { default as assert } from 'assert';
import { describe, it } from 'mocha';
import { BehaviorGzipResponse } from '../../src/behaviors/gzipResponse.js';
import { default as fs } from 'fs';

describe('BehaviorGzipResponse', function() {
    describe('gzip response', function () {
        it('should return expected lua', function (done) {
            fs.readFile(__dirname + '/gzipResponse.papi.json', 'utf8', (err, options) => {
                if (err) {
                    throw (err);
                }

                let opts = JSON.parse(options);
                let expected = [
                    '-- conditional gzip of response is not easily doable..',
                    'ngx.header["X-AKA-gzipResponse"] = "TODO_this_request_should_be_gzipped_by_proxy"',
                    'aka_gzip = "on"'
                ];

                let behavior = new BehaviorGzipResponse(opts);
                let actual = behavior.process();

                assert.equal(actual[0], expected[0]);
                assert.equal(actual[1], expected[1]);
                assert.equal(actual[2], expected[2]);
                done();
            });

        });
    });

});