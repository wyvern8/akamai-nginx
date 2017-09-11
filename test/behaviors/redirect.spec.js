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
                let expected = 'ngx.redirect("https" .. "://" .. ngx.var.host .. akamaiuri, ' + opts.responseCode + ')';
                let behavior = new BehaviorRedirect(opts);
                let actual = behavior.process();
                assert.equal(actual, expected);
                done();
            });

        });
    });

});