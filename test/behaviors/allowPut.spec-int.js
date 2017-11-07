import { describe, it } from 'mocha';
import supertest from 'supertest';
import integration from '../_integration.spec-int.js';

describe('BehaviorAllowPut', () => {

    describe('allowPut enabled', () => {

        let request = supertest(integration.urlPrefix);

        it('should allow put', (done) => {

            request
                .put(integration.testUrl('allowPut.enabled.papi.json'))
                .expect(200)
                .end(done);

        });
    });

    describe('allowPutt disabled', () => {

        let request = supertest(integration.urlPrefix);

        it('should return not allowed status code', (done) => {

            request
                .put(integration.testUrl('allowPut.disabled.papi.json'))
                .expect(405)
                .end(done);

        });
    });

});