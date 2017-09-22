import { default as assert } from 'assert';
import { CriteriaFilename } from '../../src/criteria/filename.js';

const optionsFilenameNotOneOf = {
    "matchOperator": "IS_NOT_ONE_OF",
    "values": [
        "abc.pdf"
    ],
    "matchCaseSensitive": true
};

describe('CriteriaFilename', function() {
    describe('specific match', function () {
        it('should return expected lua', function () {

            let expected = 'aka_request_file_name ~= "' + optionsFilenameNotOneOf.values[0] + '"';

            let criteria = new CriteriaFilename(optionsFilenameNotOneOf);
            let actual = criteria.process();
            assert.equal(actual, expected);
        });
    });

});