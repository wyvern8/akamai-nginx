import { default as assert } from 'assert';
import { CriteriaPath } from '../../src/criteria/path.js';

const optionsMatchAny = {
    matchOperator : 'IS_ONE_OF',
    values : [ '*' ]
};

const optionsMatchSpecific = {
    matchOperator : 'IS_ONE_OF',
    values : [ '/path/to/somewhere*', '/path/to/file2.html' ]
};

describe('CriteriaPath', function() {
    describe('specific match', function () {
        it('should return expected lua', function () {

            let expected = 'matches(akamaiuri, "' + optionsMatchSpecific.values[0] +
                '") or matches(akamaiuri, "' + optionsMatchSpecific.values[1] + '")';

            let criteria = new CriteriaPath(optionsMatchSpecific);
            let actual = criteria.process();
            assert.equal(actual, expected);
        });
    });

});