import { default as assert } from 'assert';
import { CriteriaRequestMethod } from '../../src/criteria/requestMethod.js';

const optionsIs = {
    matchOperator : 'IS',
    value : "GET"
};

const optionsIsNot = {
    matchOperator : 'IS_NOT',
    value : "GET"
};

describe('CriteriaRequestMethod', function() {
    describe('check is method', function () {
        it('should return expected lua', function () {

            let expected = 'ngx.req.get_method() == "' + optionsIs.value + '"';

            let criteria = new CriteriaRequestMethod(optionsIs);
            let actual = criteria.process();
            assert.equal(actual, expected);
        });
    });
    describe('check is not method', function () {
        it('should return expected lua', function () {

            let expected = 'ngx.req.get_method() ~= "' + optionsIsNot.value + '"';

            let criteria = new CriteriaRequestMethod(optionsIsNot);
            let actual = criteria.process();
            assert.equal(actual, expected);
        });
    });
});