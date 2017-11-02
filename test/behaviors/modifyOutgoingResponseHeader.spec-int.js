import { describe, it } from 'mocha';
import { expect } from 'chai';
import supertest from 'supertest';
import integration from './_integration.spec-int.js';

describe('BehaviorModifyOutgoingResponseHeader', () => {

    describe('response header', () => {

        let request = supertest(integration.urlPrefix);

        it('should return the expected header', (done) => {

            request
                .get(integration.behaviorTestUrl('modifyOutgoingResponseHeader.papi.json'))
                .expect(200)
                .end(function (err, res) {
                    expect(res.headers['strict-transport-security']).to.equal('max-age=31536000');
                    done();
                });

        });
    });

});