import { describe, it } from 'mocha';
import { expect } from 'chai';
import supertest from 'supertest';
import integration from '../_integration.spec-int.js';

describe('CriteriaHostname', () => {

    describe('matches on request attributes', () => {

        let request = supertest(integration.urlPrefix);

        it('should trigger behaviors if hostname matches exactly', (done) => {

            request
                .get(integration.testUrl('hostname.exact.papi.json', 'criteria'))
                .expect(200)
                .end(function (err, res) {
                    expect(res.headers[integration.checkHeaderName.toLowerCase()]).to.equal(integration.checkHeaderValue);
                    done();
                });

        });

        it('should trigger behaviors if hostname matches pattern', (done) => {

            request
                .get(integration.testUrl('hostname.pattern.papi.json', 'criteria'))
                .expect(200)
                .end(function (err, res) {
                    expect(res.headers[integration.checkHeaderName.toLowerCase()]).to.equal(integration.checkHeaderValue);
                    done();
                });

        });
    });

});