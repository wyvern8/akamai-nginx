import assert from 'assert';
import {BehaviorDenyAccess} from '../../src/behaviors/denyAccess.js';

let denyEnabledOptions = {
    "reason" : "deny-by-ip",
    "enabled" : true
};

let denyDisabledOptions = {
    "reason" : "deny-by-ip",
    "enabled" : false
};

describe('BehaviorDenyAccess', () => {
    describe('deny enabled', () => {
        it('should return expected lua', () => {
            let expected = 'ngx.var.aka_deny_reason = "' + denyEnabledOptions.reason + '"';
            let actual = new BehaviorDenyAccess(denyEnabledOptions).process();
            assert.equal(actual, expected);
        });
    });

    describe('deny disabled', () => {
        it('should return expected lua', () => {
            let expected = [
                '-- denyAccess disabled: ' + denyDisabledOptions.reason,
                'ngx.var.aka_deny_reason = ""'
            ];
            let actual = new BehaviorDenyAccess(denyDisabledOptions).process();
            assert.equal(actual[0], expected[0]);
            assert.equal(actual[1], expected[1]);
        });
    });

});