import { describe, it } from 'mocha';
import { expect } from 'chai';
import supertest from 'supertest';
import integration from '../_integration.spec-int.js';

describe('BehaviorDownstreamCache', () => {

    let headerCacheControl = 'Cache-Control';
    let headerExpires = 'Expires';
    let headerPragma = 'Pragma';

    describe('allowFromValue', () => {

        let request = supertest(integration.urlPrefix);

        it('should return the expected headers', (done) => {

            request
                .get(integration.testUrl('downstreamCache.allowFromValue.papi.json'))
                .expect(200)
                .end(function (err, res) {
                    expect(res.headers[headerCacheControl.toLowerCase()])
                        .to.equal('max-age=7776000', headerCacheControl + ' header not set correctly');

                    // eg. 1 January, 1970 00:00:01 GMT
                    expect(res.headers[headerExpires.toLowerCase()])
                        .to.match(/[0-9]+ \w+ [0-9]+ [0-9]+:[0-9]+:[0-9]+ GMT/, headerExpires + ' header not set correctly');

                    done();
                });

        });
    });

    describe('bust', () => {

        let request = supertest(integration.urlPrefix);

        it('should return the expected headers', (done) => {

            request
                .get(integration.testUrl('downstreamCache.bust.papi.json'))
                .expect(200)
                .end(function (err, res) {
                    expect(res.headers[headerCacheControl.toLowerCase()])
                        .to.equal('max-age=0, no-cache, no-store', headerCacheControl + ' header not set correctly');

                    expect(res.headers[headerExpires.toLowerCase()])
                        .to.equal('1 January, 1970 00:00:01 GMT', headerExpires + ' header not set correctly');

                    expect(res.headers[headerPragma.toLowerCase()])
                        .to.equal('no-cache', headerPragma + ' header not set correctly');

                    done();
                });

        });
    });

    describe('must revalidate', () => {

        let request = supertest(integration.urlPrefix);

        it('should return the expected headers', (done) => {

            request
                .get(integration.testUrl('downstreamCache.mustRevalidate.papi.json'))
                .expect(200)
                .end(function (err, res) {
                    expect(res.headers[headerCacheControl.toLowerCase()])
                        .to.equal('no-cache', headerCacheControl + ' header not set correctly');

                    done();
                });

        });
    });

});
