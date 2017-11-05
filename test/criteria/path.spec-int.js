import { describe, it } from 'mocha';
import { expect } from 'chai';
import supertest from 'supertest';
import integration from '../_integration.spec-int.js';

describe('CriteriaPath', () => {

    describe('matches on request attributes', () => {

        let request = supertest(integration.urlPrefix);

        it('should trigger behaviors if path matches', (done) => {

            request
                .get(integration.testUrl('path.is.papi.json', 'criteria'))
                .expect(200)
                .end(function (err, res) {
                    expect(res.headers[integration.checkHeaderName.toLowerCase()])
                        .to.equal(
                            integration.checkHeaderValue,
                            'positive path match did not trigger behavior'
                        );
                    done();
                });

        });

        it('should trigger behaviors if path DOES NOT match', (done) => {

            request
                .get(integration.testUrl('path.not.papi.json', 'criteria'))
                .expect(200)
                .end(function (err, res) {
                    expect(res.headers[integration.checkHeaderName.toLowerCase()])
                        .to.equal(
                            integration.checkHeaderValue,
                            'negative path match failed'
                        );
                    done();
                });

        });
    });

});