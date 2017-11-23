import { before, describe, it } from 'mocha';
import { expect } from 'chai';
import supertest from 'supertest';
import integration from '../_integration.spec-int.js';

describe('BehaviorSetVariable', () => {

    describe('set variable by expression containing var', () => {

        let request = supertest(integration.urlPrefix);

        it('should result in a variable value with the subvar swapped', (done) => {

            request
                .get(integration.testUrl('setVariable.expression.papi.json'))
                .expect(200)
                .end(function (err, res) {
                    expect(res.headers[integration.variableCheckHeaderName.toLowerCase()])
                        .to.equal(
                            'hostname is localhost',
                            'generator processing failed'
                        );
                    done();
                });

        });
    });

    describe('set variable by random generator', () => {

        let request = supertest(integration.urlPrefix);

        let opts;
        before( (done) => {
            integration.config().then( (papiOpts) => {
                opts = papiOpts.behavior['setVariable.generate.papi.json'];
                done();
            });
        });

        it('should result in random number in the correct range', (done) => {

            request
                .get(integration.testUrl('setVariable.generate.papi.json'))
                .expect(200)
                .end(function (err, res) {
                    let rand = parseInt(res.headers[integration.variableCheckHeaderName.toLowerCase()]);
                    expect(rand)
                        .to.be.within(
                            parseInt(opts.minRandomNumber),
                            parseInt(opts.maxRandomNumber),
                            'random number out of range'
                        );
                    done();
                });

        });
    });

    describe('set variable by querystring extract + transform upper', () => {

        let request = supertest(integration.urlPrefix);

        let opts;
        before( (done) => {
            integration.config().then( (papiOpts) => {
                opts = papiOpts.behavior['setVariable.extract-qs-upper.papi.json'];
                done();
            });
        });

        it('should set variable from querystring and transform to upper', (done) => {

            request
                .get(integration.testUrl('setVariable.extract-qs-upper.papi.json') + '&' + opts.queryParameterName + '=abc')
                .expect(200)
                .end(function (err, res) {
                    expect(res.headers[integration.variableCheckHeaderName.toLowerCase()])
                        .to.equal(
                            'ABC',
                            'querystring not set as upper var'
                        );
                    done();
                });

        });
    });

    describe('set variable by header extract + transform add', () => {

        let request = supertest(integration.urlPrefix);

        let opts;
        before( (done) => {
            integration.config().then( (papiOpts) => {
                opts = papiOpts.behavior['setVariable.extract-header-add.papi.json'];
                done();
            });
        });

        it('should set variable from header and add operandOne', (done) => {

            request
                .get(integration.testUrl('setVariable.extract-header-add.papi.json'))
                .set(opts.headerName, 5)
                .expect(200)
                .end(function (err, res) {
                    expect(res.headers[integration.variableCheckHeaderName.toLowerCase()])
                        .to.equal(
                            '10',
                            'header calculation failed'
                        );
                    done();
                });

        });
    });

});