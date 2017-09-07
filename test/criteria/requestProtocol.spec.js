import { default as assert } from 'assert';
import { CriteriaRequestProtocol } from '../../src/criteria/requestProtocol.js';

const optionsProtocolHttp = {
    value: 'HTTP'
};

describe('CriteriaRequestProtocol', function() {
    describe('specific match', function () {
        it('should return expected lua', function () {

            let expected = 'ngx.var.scheme == "' + optionsProtocolHttp.value + '"';

            let criteria = new CriteriaRequestProtocol(optionsProtocolHttp);
            let actual = criteria.process();
            assert.equal(actual, expected);
        });
    });

});