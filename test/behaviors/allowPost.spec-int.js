import { describe, it } from 'mocha';
import supertest from 'supertest';
import integration from '../_integration.spec-int.js';

describe('BehaviorAllowPost', () => {

    describe('allowPost enabled', () => {

        let request = supertest(integration.urlPrefix);

        it('should allow post', (done) => {

            request
                .post(integration.testUrl('allowPost.enabled.papi.json'))
                .expect(200)
                .end(done);

        });
    });

    describe('allowPost disabled', () => {

        let request = supertest(integration.urlPrefix);

        it('should return not allowed status code', (done) => {

            request
                .post(integration.testUrl('allowPost.disabled.papi.json'))
                .expect(405)
                .end(done);

        });
    });

});