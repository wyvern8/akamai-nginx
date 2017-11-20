import { describe, it } from 'mocha';
import { expect } from 'chai';
import supertest from 'supertest';
import integration from '../_integration.spec-int.js';

describe('CriteriaMatchVariable', () => {

    describe('exact match', () => {

        let request = supertest(integration.urlPrefix);

        it('should trigger behaviors if matches expression', (done) => {

            request
                .get(integration.testUrl('matchVariable.match.papi.json', 'criteria'))
                .expect(200)
                .end(function (err, res) {
                    expect(res.headers[integration.checkHeaderName.toLowerCase()])
                        .to.equal(
                            integration.checkHeaderValue,
                            'match expression failed'
                        );
                    done();
                });

        });
    });

    describe('match one of', () => {

        let request = supertest(integration.urlPrefix);

        it('should trigger behaviors if any value matches', (done) => {

            request
                .get(integration.testUrl('matchVariable.oneOf.papi.json', 'criteria'))
                .expect(200)
                .end(function (err, res) {
                    expect(res.headers[integration.checkHeaderName.toLowerCase()])
                        .to.equal(
                            integration.checkHeaderValue,
                            'match one of failed'
                        );
                    done();
                });

        });
    });

    describe('number between', () => {

        let request = supertest(integration.urlPrefix);

        it('should trigger behaviors if var is in numeric range', (done) => {

            request
                .get(integration.testUrl('matchVariable.between.papi.json', 'criteria'))
                .expect(200)
                .end(function (err, res) {
                    expect(res.headers[integration.checkHeaderName.toLowerCase()])
                        .to.equal(
                            integration.checkHeaderValue,
                            'var within range failed'
                        );
                    done();
                });

        });
    });

});