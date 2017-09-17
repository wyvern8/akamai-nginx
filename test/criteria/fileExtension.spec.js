import { default as assert } from 'assert';
import { CriteriaFileExtension } from '../../src/criteria/fileExtension.js';

const optionsFileExtensionOneOf = {
    "matchOperator" : "IS_ONE_OF",
    "values" : [ "jpg", "gif", "png" ],
    "matchCaseSensitive" : false
};

describe('CriteriaFileExtension', function() {
    describe('specific match', function () {
        it('should return expected lua', function () {

            let expected = 'aka_request_file_extension == "' + optionsFileExtensionOneOf.values[0] + '"' +
                ' or aka_request_file_extension == "' + optionsFileExtensionOneOf.values[1] + '"' +
                ' or aka_request_file_extension == "' + optionsFileExtensionOneOf.values[2] + '"';

            let criteria = new CriteriaFileExtension(optionsFileExtensionOneOf);
            let actual = criteria.process();
            assert.equal(actual, expected);
        });
    });

});