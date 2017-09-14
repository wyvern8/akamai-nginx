import { default as assert } from 'assert';
import { BehaviorRewriteUrl } from '../../src/behaviors/rewriteUrl.js';
import { default as fs } from 'fs';

describe('BehaviorRewriteUrl', function() {
    describe('replace path part', function () {
        it('should return expected lua', function (done) {
            fs.readFile(__dirname + '/rewriteUrl.replace.papi.json', 'utf8', (err, options) => {
                if (err) {
                    throw (err);
                }

                let opts = JSON.parse(options);
                let expected = [
                    '-- ' + opts.behavior + ' path part',
                    'aka_origin_url = string.gsub(aka_request_path, "' + opts.match + '", "' + opts.targetPath + '")',
                    'if true == ' + opts.keepQueryString + ' then',
                    '\taka_origin_url = aka_origin_url .. aka_request_qs',
                    'end'
                ];

                let actual = new BehaviorRewriteUrl(opts).process();

                assert.equal(actual[0], expected[0]);
                assert.equal(actual[1], expected[1]);
                done();
            });

        });
    });

});