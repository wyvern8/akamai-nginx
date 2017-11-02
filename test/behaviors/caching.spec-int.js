import { before, describe, it } from 'mocha';
import { expect } from 'chai';
import supertest from 'supertest';
import integration from './_integration.spec-int.js';

describe('BehaviorCpCode', () => {

    let opts;
    before( (done) => {
        integration.behaviorConfig().then( (data) => {
            opts = data['cpCode.papi.json'];
            done();
        });
    });

    describe('cpCode header', () => {

        let request = supertest(integration.urlPrefix);

        it('should return the expected header', (done) => {

            let header = opts.value.id + (opts.value.name ? '_' + opts.value.name.replace(' ', '_') : '');

            request
                .get(integration.behaviorTestUrl('cpCode.papi.json'))
                .expect(200)
                .end(function (err, res) {
                    expect(res.headers['x-aka-cpcode']).to.equal(header);
                    done();
                });

        });
    });

});