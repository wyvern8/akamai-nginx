import { describe, it } from 'mocha';
import { expect } from 'chai';
import supertest from 'supertest';
import integration from '../_integration.spec-int.js';

describe('CriteriaFileExtension', () => {

    describe('matches on request attributes', () => {

        let request = supertest(integration.urlPrefix);

        it('should trigger behaviors if file extension matches', (done) => {

            request
                .get(integration.testUrl('fileExtension.papi.json', 'criteria', '/test.jpg'))
                .expect(200)
                .end(function (err, res) {
                    expect(res.headers[integration.checkHeaderName.toLowerCase()]).to.equal(integration.checkHeaderValue);
                    done();
                });

        });
    });

});