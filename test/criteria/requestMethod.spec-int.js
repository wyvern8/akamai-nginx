import { describe, it } from 'mocha';
import { expect } from 'chai';
import supertest from 'supertest';
import integration from '../_integration.spec-int.js';

describe('CriteriaRequestMethod', () => {

    describe('matches on request attributes', () => {

        let request = supertest(integration.urlPrefix);

        it('should trigger behaviors if request method matches', (done) => {

            request
                .get(integration.testUrl('requestMethod.is.papi.json', 'criteria'))
                .expect(200)
                .end(function (err, res) {
                    expect(res.headers[integration.checkHeaderName.toLowerCase()])
                        .to.equal(
                            integration.checkHeaderValue,
                            'request method positive check failed'
                        );
                    done();
                });

        });

        it('should trigger behaviors if request method DOES NOT match', (done) => {

            request
                .post(integration.testUrl('requestMethod.not.papi.json', 'criteria'))
                .expect(200)
                .end(function (err, res) {
                    expect(res.headers[integration.checkHeaderName.toLowerCase()])
                        .to.equal(
                            integration.checkHeaderValue,
                            'request method negative check failed'
                        );
                    done();
                });

        });
    });

});