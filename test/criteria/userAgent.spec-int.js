import { describe, it } from 'mocha';
import { expect } from 'chai';
import supertest from 'supertest';
import integration from '../_integration.spec-int.js';

describe('CriteriaUserAgent', () => {

    describe('matches on request attributes', () => {

        let request = supertest(integration.urlPrefix);

        it('should trigger behaviors if user agent matches', (done) => {

            request
                .get(integration.testUrl('userAgent.papi.json', 'criteria'))
                .set('User-Agent', 'automated integration test')
                .expect(200)
                .end(function (err, res) {
                    expect(res.headers[integration.checkHeaderName.toLowerCase()])
                        .to.equal(
                            integration.checkHeaderValue,
                            'user agent match failed'
                        );
                    done();
                });

        });
    });

});