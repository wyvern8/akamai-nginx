import { default as assert } from 'assert';
import { describe, it } from 'mocha';
import { CriteriaFileExtension } from '../../src/criteria/fileExtension.js';
import { default as fs } from 'fs';

describe('CriteriaFileExtension', function() {
    describe('specific match', function () {
        it('should return expected lua', function (done) {
            fs.readFile(__dirname + '/fileExtension.papi.json', 'utf8', (err, options) => {
                if (err) {
                    throw (err);
                }
                let opts = JSON.parse(options);

                let expected = 'aka_request_file_extension == swapVars("' + opts.values[0] + '")' +
                    ' or aka_request_file_extension == swapVars("' + opts.values[1] + '")' +
                    ' or aka_request_file_extension == swapVars("' + opts.values[2] + '")';

                let criteria = new CriteriaFileExtension(opts);
                let actual = criteria.process(true);
                assert.equal(actual, expected);
                done();
            });
        });
    });

});