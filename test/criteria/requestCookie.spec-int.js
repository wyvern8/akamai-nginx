import { before, describe, it } from 'mocha';
import { expect } from 'chai';
import supertest from 'supertest';
import integration from '../_integration.spec-int.js';

describe('CriteriaRequestCookie', () => {

    let opts;
    before( (done) => {
        integration.config().then( (papiOpts) => {
            opts = papiOpts.criteria['requestCookie.papi.json'];
            done();
        });
    });

    describe('matches on request attributes', () => {

        let request = supertest(integration.urlPrefix);

        it('should trigger behaviors if cookie value matches', (done) => {

            request
                .get(integration.testUrl('requestCookie.papi.json', 'criteria'))
                .set('Cookie', opts.cookieName + '=' + opts.value)
                .expect(200)
                .end(function (err, res) {
                    expect(res.headers[integration.checkHeaderName.toLowerCase()])
                        .to.equal(
                            integration.checkHeaderValue,
                            'cookie match failed'
                        );
                    done();
                });

        });
    });

});