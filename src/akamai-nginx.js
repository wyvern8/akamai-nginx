import fs from 'fs';
import { Rule } from './rule.js';

let config = {};

export function setApiConfig(edgegrid, contractId, groupId, propertyId, propertyVersion, outputFile) {
    config = {};
    config.edgegrid = edgegrid;
    config.contractId = contractId;
    config.groupId = groupId;
    config.propertyId = propertyId;
    config.propertyVersion = propertyVersion;
    config.outPutFile = outputFile;
    return this;
}

export function setLocalConfig(localPapiJsonPath, outputFile) {
    config = {};
    config.localPapiJsonPath = localPapiJsonPath;
    config.outPutFile = outputFile;
    return this;
}

let valueMap = new Map([
    ['HTTP', 'http'],
    ['HTTPS', 'https']
]);

export function setValueMap(map) {
    valueMap = new Map([...valueMap, ...map]);
}

let skipBehaviors = [
    'webApplicationFirewall'
];

export function setSkipBehaviors(skip) {
    skipBehaviors = [...skipBehaviors, ...skip];
}

function getPapiUrl() {
    return '/papi/v1/properties/' + config.propertyId + '/versions/' + config.propertyVersion +
        '/rules?contractId=' + config.contractId + '&groupId=' + config.groupId;
}

export async function generateConf() {

    let propertyRules = await getPropertyRules();
    let propertyName = propertyRules.propertyName;
    let propertyVersion = propertyRules.propertyVersion;

    console.log('processing rules for property ' + propertyName + ' v' + propertyVersion);

    let defaultRule = new Rule(
        propertyRules.rules.name,
        propertyRules.rules.criteria,
        propertyRules.rules.criteriaMustSatisfy,
        propertyRules.rules.behaviors,
        propertyRules.rules.children,
        skipBehaviors,
        valueMap,
        0 // depth starts at 0
    );

    let conf = '-- ### generated from ';
    conf +=  config.localPapiJsonPath ? 'local: ' + config.localPapiJsonPath : 'api: ' + getPapiUrl() + ' ###';
    conf += '\n' + defaultRule.process();

    let fns = fs.readFileSync(__dirname + '/../lua/akamaiFunctions.lua', 'utf8');
    conf = fns + conf + '\nfinalActions()';

    // create empty file
    fs.closeSync(fs.openSync(config.outPutFile, 'w'));
    fs.writeFileSync(config.outPutFile, conf, 'utf8');

    console.log('processing completed for property ' + propertyName + ' v' + propertyVersion);

}

async function getPropertyRules() {
    return new Promise(
        (resolve, reject) => {
            if (config.localPapiJsonPath) {
                // load local
                console.log('loading local rules from: ' + config.localPapiJsonPath + '\n');
                fs.readFile(config.localPapiJsonPath, (err, rules) => {
                    if (err) {
                        return reject(err);
                    }
                    return resolve(JSON.parse(rules));
                });

            } else {

                // or call papi
                let papiUrl = getPapiUrl();
                console.log('loading rules from papi url: ' + papiUrl + '\n');

                config.edgegrid.auth({
                    path: papiUrl,
                    method: 'GET'
                }).send((error, response, body) => {
                    console.debug('akamai api response body: %o', body);
                    return resolve(JSON.parse(body));
                });
            }
        });
}
