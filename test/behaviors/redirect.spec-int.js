import { before, describe, it } from 'mocha';
import { expect } from 'chai';
import supertest from 'supertest';
import integration from '../_integration.spec-int.js';

describe('BehaviorRedirect', () => {

    let opts;
    before( (done) => {
        integration.config().then( (papiOpts) => {
            opts = papiOpts.behavior['redirect.path.papi.json'];
            done();
        });
    });

    describe('redirect to specific path on current domain', () => {

        let request = supertest(integration.urlPrefix);

        it('should redirect to the correct location', (done) => {

            request
                .get(integration.testUrl('redirect.path.papi.json'))
                .expect(opts.responseCode)
                .end(function (err, res) {
                    expect(res.headers['location'])
                        .to.equal(
                            integration.urlPrefix + opts.destinationPathOther + '?nocache=true',
                            'redirect location not set correctly'
                        );
                    done();
                });

        });
    });

    describe('redirect http to https', () => {

        let request = supertest(integration.urlPrefix.replace('https', 'http'));

        it('should redirect to the correct location', (done) => {

            request
                .get(integration.testUrl('redirect.https.papi.json'))
                .expect(301)
                .end(function (err, res) {
                    expect(res.headers['location']).to.equal(
                        integration.urlPrefix + integration.testUrl('redirect.https.papi.json')
                    );
                    done();
                });

        });
    });

});