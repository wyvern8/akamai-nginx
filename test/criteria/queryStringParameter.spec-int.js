import { before, describe, it } from 'mocha';
import { expect } from 'chai';
import supertest from 'supertest';
import integration from '../_integration.spec-int.js';

describe('CriteriaQueryStringParameter', () => {

    let opts;
    before( (done) => {
        integration.config().then( (papiOpts) => {
            opts = papiOpts.criteria['queryStringParameter.papi.json'];
            done();
        });
    });

    describe('matches on request attributes', () => {

        let request = supertest(integration.urlPrefix);

        it('should trigger behaviors if queryString matches', (done) => {

            request
                .get(integration.testUrl('queryStringParameter.papi.json', 'criteria') +
                    '&' + opts.parameterName + '=' + opts.values[0])
                .expect(200)
                .end(function (err, res) {
                    expect(res.headers[integration.checkHeaderName.toLowerCase()])
                        .to.equal(
                            integration.checkHeaderValue,
                            'query string match failed'
                        );
                    done();
                });

        });
    });

});