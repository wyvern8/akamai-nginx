import { default as assert } from 'assert';
import { CriteriaQueryStringParameter } from '../../src/criteria/queryStringParameter.js';

const optionsQueryStringOneOf = {
    "parameterName" : "myquery",
    "matchOperator" : "IS_ONE_OF",
    "matchWildcardName" : false,
    "matchCaseSensitiveName" : true,
    "values" : [ "abc", "def" ],
    "matchWildcardValue" : false,
    "matchCaseSensitiveValue" : true,
    "escapeValue" : false
};

describe('CriteriaRequestHeader', function() {
    describe('match one of', function () {
        it('should return expected lua', function () {

            let expected = 'ngx.req.get_uri_args()["' + optionsQueryStringOneOf.parameterName + '"]' +
                ' == "' + optionsQueryStringOneOf.values[0] + '" or ' +
                'ngx.req.get_uri_args()["' + optionsQueryStringOneOf.parameterName + '"]' +
                ' == "' + optionsQueryStringOneOf.values[1] + '"';

            let criteria = new CriteriaQueryStringParameter(optionsQueryStringOneOf);
            let actual = criteria.process();
            assert.equal(actual, expected);
        });
    });

});