import { before, describe, it } from 'mocha';
import { expect } from 'chai';
import supertest from 'supertest';
import integration from '../_integration.spec-int.js';

describe('BehaviorModifyOutgoingResponseHeader', () => {

    let opts;
    before( (done) => {
        integration.config().then( (papiOpts) => {
            opts = papiOpts.behavior['modifyOutgoingResponseHeader.papi.json'];
            done();
        });
    });

    describe('response header', () => {

        let request = supertest(integration.urlPrefix);

        it('should return the expected header', (done) => {

            request
                .get(integration.testUrl('modifyOutgoingResponseHeader.papi.json'))
                .expect(200)
                .end(function (err, res) {
                    expect(res.headers[opts.customHeaderName.toLowerCase()])
                        .to.equal(opts.newHeaderValue, 'response header not set correctly');
                    done();
                });

        });
    });

});