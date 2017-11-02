import { describe, it } from 'mocha';
import { expect } from 'chai';
import supertest from 'supertest';
import integration from './_integration.spec-int.js';

describe('BehaviorRedirect', () => {

    describe('redirect to specific path on current domain', () => {

        let request = supertest(integration.urlPrefix);

        it('should redirect to the correct location', (done) => {

            request
                .get(integration.behaviorTestUrl('redirect.path.papi.json'))
                .expect(301)
                .end(function (err, res) {
                    expect(res.headers['location']).to.equal('https://localhost/testredirect?nocache=true');
                    done();
                });

        });
    });

    describe('redirect http to https', () => {

        let request = supertest(integration.urlPrefix.replace('https', 'http'));

        it('should redirect to the correct location', (done) => {

            request
                .get(integration.behaviorTestUrl('redirect.https.papi.json'))
                .expect(301)
                .end(function (err, res) {
                    expect(res.headers['location']).to.equal(
                        integration.urlPrefix + integration.behaviorTestUrl('redirect.https.papi.json')
                    );
                    done();
                });

        });
    });

});