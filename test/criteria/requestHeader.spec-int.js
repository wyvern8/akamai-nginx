import { before, describe, it } from 'mocha';
import { expect } from 'chai';
import supertest from 'supertest';
import integration from '../_integration.spec-int.js';

describe('CriteriaRequestHeader', () => {

    let opts;
    before( (done) => {
        integration.config().then( (papiOpts) => {
            opts = papiOpts.criteria['requestHeader.papi.json'];
            done();
        });
    });

    describe('matches on request attributes', () => {

        let request = supertest(integration.urlPrefix);

        it('should trigger behaviors if header value matches', (done) => {

            request
                .get(integration.testUrl('requestHeader.papi.json', 'criteria'))
                .set(opts.headerName, opts.values[0])
                .expect(200)
                .end(function (err, res) {
                    expect(res.headers[integration.checkHeaderName.toLowerCase()])
                        .to.equal(integration.checkHeaderValue, 'header value match failed');
                    done();
                });

        });
    });

});