import assert from 'assert';
import { describe, it } from 'mocha';
import { BehaviorDownstreamCache } from '../../src/behaviors/downstreamCache.js';
import { default as fs } from 'fs';

describe('BehaviorDownstreamCache', () => {
    describe('bust', () => {
        it('should return expected lua', (done) => {
            fs.readFile(__dirname + '/downstreamCache.bust.papi.json', 'utf8', (err, options) => {
                if (err) {
                    throw (err);
                }
                let opts = JSON.parse(options);

                let expected = [
                    'aka_downstream_headers["Cache-Control"] = {"SET", "max-age=0, no-cache, no-store"}',
                    'aka_downstream_headers["Pragma"] = {"SET", "no-cache"}',
                    'aka_downstream_headers["Expires"] = {"SET", "1 January, 1970 00:00:01 GMT"}'
                ];

                let actual = new BehaviorDownstreamCache(opts).process();

                assert.equal(actual[0], expected[0]);
                assert.equal(actual[1], expected[1]);
                assert.equal(actual[2], expected[2]);
                done();
            });
        });
    });
    describe('tunnel origin', () => {
        it('should return expected lua', (done) => {
            fs.readFile(__dirname + '/downstreamCache.tunnel.papi.json', 'utf8', (err, options) => {
                if (err) {
                    throw (err);
                }
                let opts = JSON.parse(options);

                let expected = '-- let cache headers pass though from origin';

                let actual = new BehaviorDownstreamCache(opts).process();

                assert.equal(actual, expected);
                done();
            });
        });
    });
    describe('allow max age', () => {
        it('should return expected lua', (done) => {
            fs.readFile(__dirname + '/downstreamCache.allowMaxAge.papi.json', 'utf8', (err, options) => {
                if (err) {
                    throw (err);
                }
                let opts = JSON.parse(options);

                let expected = [
                    'aka_downstream_headers["Cache-Control"] = {"SET", "max-age=" .. ngx.var.aka_cache_ttl_seconds}',
                    'aka_downstream_headers["Expires"] = {"SET", expiryDateString(ngx.var.aka_cache_ttl_seconds)}',
                    '-- let cache headers pass though',
                    'ngx.header["Cache-Control"] = "private"'
                ];

                let actual = new BehaviorDownstreamCache(opts).process();

                assert.equal(actual[0], expected[0]);
                assert.equal(actual[1], expected[1]);
                assert.equal(actual[2], expected[2]);
                assert.equal(actual[3], expected[3]);
                done();
            });
        });
    });
    describe('allow from value', () => {
        it('should return expected lua', (done) => {
            fs.readFile(__dirname + '/downstreamCache.allowFromValue.papi.json', 'utf8', (err, options) => {
                if (err) {
                    throw (err);
                }
                let opts = JSON.parse(options);

                let expected = [
                    'aka_downstream_headers["Cache-Control"] = {"SET", "max-age=" .. 7776000}',
                    'aka_downstream_headers["Expires"] = {"SET", expiryDateString(7776000)}'
                ];

                let actual = new BehaviorDownstreamCache(opts).process();

                assert.equal(actual[0], expected[0]);
                assert.equal(actual[1], expected[1]);
                done();
            });
        });
    });
    describe('must revalidate', () => {
        it('should return expected lua', (done) => {
            fs.readFile(__dirname + '/downstreamCache.mustRevalidate.papi.json', 'utf8', (err, options) => {
                if (err) {
                    throw (err);
                }
                let opts = JSON.parse(options);

                let expected = 'aka_downstream_headers["Cache-Control"] = {"SET", "no-cache"}';

                let actual = new BehaviorDownstreamCache(opts).process();

                assert.equal(actual, expected);
                done();
            });
        });
    });

});