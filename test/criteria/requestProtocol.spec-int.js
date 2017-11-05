import { describe, it } from 'mocha';
import { expect } from 'chai';
import supertest from 'supertest';
import integration from '../_integration.spec-int.js';

describe('CriteriaRequestProtocol', () => {

    describe('matches on request attributes', () => {

        let request = supertest(integration.urlPrefix.replace('https', 'http'));

        it('should trigger behaviors if request protocol matches', (done) => {

            request
                .get(integration.testUrl('requestProtocol.papi.json', 'criteria'))
                .expect(200)
                .end(function (err, res) {
                    expect(res.headers[integration.checkHeaderName.toLowerCase()])
                        .to.equal(
                            integration.checkHeaderValue,
                            'request protocol match failed'
                        );
                    done();
                });

        });
    });

});