import assert from 'assert';
import { BehaviorModifyOutgoingResponseHeader } from '../../src/behaviors/modifyOutgoingResponseHeader.js';

let options = {
    "action": "MODIFY",
    "standardModifyHeaderName": "OTHER",
    "customHeaderName": "Strict-Transport-Security",
    "newHeaderValue": "max-age=31536000",
    "avoidDuplicateHeaders": true
}

describe('BehaviorModifyOutgoingResponseHeader', () => {
    describe('other header', () => {
        it('should return expected lua', (done) => {
            let expected = [
                '-- ' + options.action + ' response header to client',
                'ngx.header["' + options.customHeaderName + '"] = "' + options.newHeaderValue + '"'
            ];

            let actual = new BehaviorModifyOutgoingResponseHeader(options).process();

            assert.equal(actual[0], expected[0]);
            assert.equal(actual[1], expected[1]);
            done();
        });
    });

});