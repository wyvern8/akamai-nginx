import { describe, it } from 'mocha';
import { expect } from 'chai';
import supertest from 'supertest';
import integration from '../_integration.spec-int.js';

describe('BehaviorCaching', () => {

    describe('caching header', () => {

        let request = supertest(integration.urlPrefix);

        it('should return the expected header', (done) => {

            request
                .get(integration.testUrl('caching.papi.json'))
                .expect(200)
                .end(function (err, res) {
                    expect(res.headers['x-accel-expires']).to.equal('7200');
                    done();
                });

        });
    });

});