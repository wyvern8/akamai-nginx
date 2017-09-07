import { default as assert } from 'assert';
import { CriteriaHostname } from '../../src/criteria/hostname.js';

const optionsMatchAny = {
    matchOperator : 'IS_ONE_OF',
    values : [ '*' ]
};

const optionsMatchSpecific = {
    matchOperator : 'IS_ONE_OF',
    values : [ 'akamai.com', 'edgekey.net' ]
};

describe('CriteriaHostname', function() {
    describe('specific match', function () {
        it('should return expected lua', function () {

            let expected = 'ngx.var.host == "' + optionsMatchSpecific.values[0] +
                '" or ngx.var.host == "' + optionsMatchSpecific.values[1] + '"';

            let criteria = new CriteriaHostname(optionsMatchSpecific);
            let actual = criteria.process();
            assert.equal(actual, expected);
        });
    });

});