import { default as assert } from 'assert';
import { CriteriaRequestHeader } from '../../src/criteria/requestHeader.js';

const optionsHeaderEquals = {
    "headerName" : "x-testing",
    "matchOperator" : "IS_ONE_OF",
    "values" : [ "testvalue", "testing2" ],
    "matchWildcardName" : false,
    "matchWildcardValue" : false,
    "matchCaseSensitiveValue" : true
};

describe('CriteriaRequestHeader', function() {
    describe('match one of', function () {
        it('should return expected lua', function () {

            let expected = 'ngx.req.get_headers()["' + optionsHeaderEquals.headerName + '"]' +
                ' == "' + optionsHeaderEquals.values[0] + '" or ' +
                'ngx.req.get_headers()["' + optionsHeaderEquals.headerName + '"]' +
                ' == "' + optionsHeaderEquals.values[1] + '"';

            let criteria = new CriteriaRequestHeader(optionsHeaderEquals);
            let actual = criteria.process();
            assert.equal(actual, expected);
        });
    });

});