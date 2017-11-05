import { describe, it } from 'mocha';
import { expect } from 'chai';
import supertest from 'supertest';
import integration from '../_integration.spec-int.js';

describe('CriteriaFileName', () => {

    describe('matches on request attributes', () => {

        let request = supertest(integration.urlPrefix);

        it('should trigger behaviors if filename matches', (done) => {

            request
                .get(integration.testUrl('filename.is.papi.json', 'criteria', '/abc.pdf'))
                .expect(200)
                .end(function (err, res) {
                    expect(res.headers[integration.checkHeaderName.toLowerCase()]).to.equal(integration.checkHeaderValue);
                    done();
                });

        });

        it('should trigger behaviors if filename DOES NOT match', (done) => {

            request
                .get(integration.testUrl('filename.not.papi.json', 'criteria', '/wrong.pdf'))
                .expect(200)
                .end(function (err, res) {
                    expect(res.headers[integration.checkHeaderName.toLowerCase()]).to.equal(integration.checkHeaderValue);
                    done();
                });

        });
    });

});