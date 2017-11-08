import { describe, it } from 'mocha';
import { expect } from 'chai';
import supertest from 'supertest';
import integration from '../_integration.spec-int.js';

describe('BehaviorGzipResponse', () => {

    describe('gzip header', () => {

        let request = supertest(integration.urlPrefix);

        it('should return the expected header', (done) => {

            request
                .get(integration.testUrl('gzipResponse.papi.json'))
                .expect(200)
                .end(function (err, res) {
                    expect(res.headers['x-aka-gzipresponse'])
                        .to.equal('true', 'gzip message header not set');
                    done();
                });

        });
    });

});