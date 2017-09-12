import { default as assert } from 'assert';
import { BehaviorRedirect } from '../../src/behaviors/redirect.js';
import { default as fs } from 'fs';

describe('BehaviorRedirect', function() {
    describe('redirect https', function () {
        it('should return expected lua', function (done) {
            fs.readFile(__dirname + '/redirect.https.papi.json', 'utf8', (err, options) => {
                if (err) {
                    throw (err);
                }

                let opts = JSON.parse(options);
                let expected = [
                    'ngx.var.aka_redirect_location = "https" .. "://" .. aka_request_host .. aka_request_path' +
                    ' .. "?" .. aka_request_qs',
                    'ngx.var.aka_redirect_code = "'+ opts.responseCode + '"'
                ];

                let behavior = new BehaviorRedirect(opts);
                let actual = behavior.process();

                assert.equal(actual[0], expected[0]);
                assert.equal(actual[1], expected[1]);
                done();
            });

        });
    });

});