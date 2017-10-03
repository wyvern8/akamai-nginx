import { default as assert } from 'assert';
import { describe, it } from 'mocha';
import { CriteriaFilename } from '../../src/criteria/filename.js';
import { default as fs } from 'fs';

describe('CriteriaFilename', function() {
    describe('specific match', function () {
        it('should return expected lua', function (done) {
            fs.readFile(__dirname + '/filename.papi.json', 'utf8', (err, options) => {
                if (err) {
                    throw (err);
                }
                let opts = JSON.parse(options);

                let expected = 'aka_request_file_name ~= "' + opts.values[0] + '"';

                let criteria = new CriteriaFilename(opts);
                let actual = criteria.process(true);
                assert.equal(actual, expected);
                done();
            });
        });
    });

});