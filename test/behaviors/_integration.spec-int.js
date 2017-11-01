import { default as fs } from 'fs';
import appRoot from 'app-root-path';
import globule from 'globule';
import { setLocalConfig, generateConf } from '../../src/akamai-nginx.js';

//lazy init
let behaviorOpts = {};

let integrationUrlPrefix = 'http://localhost';
let integrationUrlPathBehavior = '/integration/behavior/';

async function behaviorConfig() {

    if (Object.keys(behaviorOpts).length > 0) {
        console.log('returning existing config..');
        return behaviorOpts;
    }

    // load template papi json to inject behavior rules to test
    let integrationPapi = JSON.parse(fs.readFileSync(appRoot + '/test/behaviors/_integration.template.json', 'utf8'));

    globule.find(appRoot + '/test/behaviors/**/*.papi.json').forEach((behaviorPapiPath) => {

        let behaviorPapiPathParts = behaviorPapiPath.split('/');
        let behaviorPapiFilename = behaviorPapiPathParts[behaviorPapiPathParts.length-1];
        let behaviorName = behaviorPapiFilename.split('.')[0];
        let behaviorUrl = behaviorPapiFilename.replace('.papi.json', '');

        let opts = JSON.parse(fs.readFileSync(behaviorPapiPath, 'utf8'));

        behaviorOpts[behaviorPapiFilename] = opts;

        integrationPapi.rules.children.push({
            name: behaviorName,
            children: [ ],
            behaviors: [ {
                name: behaviorName,
                options : opts
            } ],
            criteria: [ {
                name: 'path',
                options : {
                    matchOperator: 'MATCHES_ONE_OF',
                    values: [ integrationUrlPathBehavior + behaviorUrl ],
                    matchCaseSensitive : false
                }
            } ],
            criteriaMustSatisfy : 'all'
        });
    });

    setLocalConfig(
        appRoot + '/test/behaviors/_integration.template.json', // will load modified as integrationPapi
        appRoot + '/lua/akamai.lua'
    );

    await generateConf(integrationPapi);

    return behaviorOpts;
}

function behaviorTestUrl(papiJsonFileName) {
    return integrationUrlPathBehavior + papiJsonFileName.replace('.papi.json', '') + '?nocache=true';
}

module.exports.urlPrefix = integrationUrlPrefix;
module.exports.behaviorTestUrl = behaviorTestUrl;
module.exports.behaviorConfig = behaviorConfig;

