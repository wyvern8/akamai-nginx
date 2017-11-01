import { describe, it } from 'mocha';
import supertest from 'supertest';
import integration from './_integration.spec-int.js';

describe('BehaviorDenyAccess', () => {

    describe('denyAccess enabled', () => {

        let request = supertest(integration.urlPrefix);

        it('should return denied status code', (done) => {

            request
                .get(integration.behaviorTestUrl('denyAccess.enabled.papi.json'))
                .expect(401)
                .end(done);

        });
    });

    describe('denyAccess disabled', () => {

        let request = supertest(integration.urlPrefix);

        it('should NOT return denied status code', (done) => {

            request
                .get(integration.behaviorTestUrl('denyAccess.disabled.papi.json'))
                .expect(200)
                .end(done);

        });
    });

});