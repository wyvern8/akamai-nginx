import { default as assert } from 'assert';
import { CriteriaRequestCookie } from '../../src/criteria/requestCookie.js';

const optionsCookieEquals = {
    "cookieName" : "usertype",
    "matchOperator" : "IS",
    "value" : "redirectedUser",
    "matchWildcardName" : false,
    "matchCaseSensitiveName" : true,
    "matchWildcardValue" : false,
    "matchCaseSensitiveValue" : true
};

describe('CriteriaRequestCookie', function() {
    describe('specific match', function () {
        it('should return expected lua', function () {

            let expected = 'ngx.var.cookie_ .. "' + optionsCookieEquals.cookieName + '" ' +
                '== "' + optionsCookieEquals.value + '"';

            let criteria = new CriteriaRequestCookie(optionsCookieEquals);
            let actual = criteria.process();
            assert.equal(actual, expected);
        });
    });

});