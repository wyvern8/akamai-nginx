import { before } from 'mocha';
import fs from 'fs';
import path from 'path';
import appRoot from 'app-root-path';
import { setLocalConfig, generateConf } from '../src/akamai-nginx.js';

//lazy init
let papiOpts = {};
papiOpts.behavior = {};
papiOpts.criteria = {};

let integrationUrlPrefix = 'https://localhost';
let integrationUrlPathCriteria = '/integration/criteria/';
let integrationUrlPathBehavior = '/integration/behavior/';

let checkHeaderName = 'CRITERIA-TEST';
let checkHeaderValue = 'BEHAVIOR-TRIGGERED';

let variableCheckHeaderName = 'SETVARIABLE-RESULT';

// trigger config build before describe blocks
before( (done) => {
    integrationConfig().then( () => {
        done();
    });
});

// todo use agent in supertest instead
process.env.NODE_TLS_REJECT_UNAUTHORIZED = '0';

async function integrationConfig() {

    if (Object.keys(papiOpts.behavior).length > 0 || Object.keys(papiOpts.criteria).length > 0) {
        console.log('returning existing config..');
        return papiOpts;
    }

    // load template papi json to inject behavior rules to test
    let integrationPapi = JSON.parse(fs.readFileSync(appRoot + '/test/_integration.template.json', 'utf8'));

    // add sample vars
    integrationPapi.rules.variables.push(...[
        {
            name: 'PMUSER_TEST_MATCH',
            value: 'exactMatchMe',
            description: 'a test variable',
            hidden: false,
            sensitive: false
        },
        {
            name: 'PMUSER_TEST_ONE_OF',
            value: 'aklm',
            description: 'a test variable',
            hidden: false,
            sensitive: false
        },
        {
            name: 'PMUSER_TEST_BETWEEN',
            value: '150',
            description: 'a test variable',
            hidden: false,
            sensitive: false
        },
        {
            name: 'PMUSER_TEST_SETVARIABLE',
            value: '150',
            description: 'placeholder',
            hidden: false,
            sensitive: false
        }
    ]);

    const directoryPath = path.join(appRoot, 'test');
    const searchPattern = /\.papi\.json$/;

    // Recursive function to find all .papi.json files in subdirectories
    function findFiles(dir) {
        let results = [];
        fs.readdirSync(dir).forEach((file) => {
            const filePath = path.join(dir, file);
            const stat = fs.statSync(filePath);

            if (stat && stat.isDirectory()) {
                results = results.concat(findFiles(filePath));
            } else if (searchPattern.test(file)) {
                results.push(filePath);
            }
        });
        return results;
    }

    findFiles(directoryPath).forEach((papiPath) => {

        let isBehavior = papiPath.indexOf('behavior') > -1;

        let papiPathParts = papiPath.split('/');
        let papiFilename = papiPathParts[papiPathParts.length-1];
        let papiName = papiFilename.split('.')[0];
        let url = papiFilename.replace('.papi.json', '');

        let opts = JSON.parse(fs.readFileSync(papiPath, 'utf8'));

        if (isBehavior) {
            papiOpts.behavior[papiFilename] = opts;

            let behaviors = [];
            behaviors.push({
                name: papiName,
                options: opts
            });

            // if this is a setVariable behavior, return a header for testing result
            if (papiName === 'setVariable') {
                behaviors.push({
                    name: 'modifyOutgoingResponseHeader',
                    options: {
                        action: 'MODIFY',
                        standardModifyHeaderName: 'OTHER',
                        customHeaderName: variableCheckHeaderName,
                        newHeaderValue: '{{user.' + opts.variableName + '}}',
                        avoidDuplicateHeaders: true
                    }
                });
            }

            integrationPapi.rules.children.push({
                name: 'behavior ' + papiName,
                children: [],
                behaviors: behaviors,
                criteria: [{
                    name: 'path',
                    options: {
                        matchOperator: 'MATCHES_ONE_OF',
                        values: [integrationUrlPathBehavior + url],
                        matchCaseSensitive: false
                    }
                }],
                criteriaMustSatisfy: 'all'
            });

        } else {
            papiOpts.criteria[papiFilename] = opts;

            integrationPapi.rules.children.push({
                name: 'criteria ' + papiName,
                children: [],
                behaviors: [{
                    name: 'modifyOutgoingResponseHeader',
                    options: {
                        'action': 'MODIFY',
                        'standardModifyHeaderName': 'OTHER',
                        'customHeaderName': checkHeaderName,
                        'newHeaderValue': checkHeaderValue,
                        'avoidDuplicateHeaders': true
                    }
                }],
                criteria: [
                    {
                        name: 'path',
                        options: {
                            matchOperator: 'MATCHES_ONE_OF',
                            values: [integrationUrlPathCriteria + url],
                            matchCaseSensitive: false
                        }
                    },
                    {
                        name: papiName,
                        options: opts
                    }
                ],
                criteriaMustSatisfy: 'all'
            });
        }

    });

    setLocalConfig(
        appRoot + '/test/_integration.template.json', // will load modified as integrationPapi
        appRoot + '/lua/akamai.lua'
    );

    await generateConf(integrationPapi);

    // give nginx a few seconds to pickup changes
    await timeout(5000);

    return papiOpts;
}

function timeout(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
}

function integrationTestUrl(papiJsonFileName, type, pathSuffix) {
    if (!pathSuffix) pathSuffix = '';
    if (!type || type !== 'criteria') {
        return integrationUrlPathBehavior + papiJsonFileName.replace('.papi.json', '') + pathSuffix + '?nocache=true';
    } else {
        return integrationUrlPathCriteria + papiJsonFileName.replace('.papi.json', '') + pathSuffix + '?nocache=true';
    }
}

module.exports.variableCheckHeaderName = variableCheckHeaderName;
module.exports.checkHeaderName = checkHeaderName;
module.exports.checkHeaderValue = checkHeaderValue;
module.exports.urlPrefix = integrationUrlPrefix;
module.exports.testUrl = integrationTestUrl;
module.exports.config = integrationConfig;

