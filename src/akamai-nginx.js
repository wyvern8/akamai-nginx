import fs from 'fs';
import { Rule } from './rule.js';

let config = {};

process.on('unhandledRejection', (reason, p) => {
    console.log('Unhandled Rejection at: Promise', p, 'reason:', reason);
    // application specific logging, throwing an error, or other logic here
});

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

function buildLuaVarMap(propertyRules) {

    // load builtin var definitions
    let variableDefns = JSON.parse(fs.readFileSync(__dirname + '/akamai-vars.json', 'utf8'));

    // collect any pmuser declared vars for property
    if (propertyRules.rules.variables.length > 0) {
        propertyRules.rules.variables.forEach( (pmUserVar) => {
            variableDefns.push({
                key: pmUserVar.name,
                lua: '"' + pmUserVar.value + '"',
                comment: pmUserVar.description
            });
        });
    }

    let lua = '\n\n-- ### Generated varMap from akamai-vars.json and property vars..\n';
    lua += 'local varMap = { }\n';
    variableDefns.forEach((variable) => {
        lua += '-- ' + variable.comment + '\n';
        lua += 'varMap["' + variable.key + '"] = function() return ' + variable.lua + ' end\n\n';
    });

    return lua;
}

function buildLuaValueMap(valueMap) {
    let lua = '\n\n-- ### Generated valueMap from valueMap.local.json and passed in valueMap..\n';
    lua += 'local valueMap = { }\n';
    for (let [key, value] of valueMap.entries()) {
        lua += 'valueMap["' + key + '"] = "' + value + '"\n';
    }
    return lua;
}

export async function generateConf(preloadedRules) {

    let propertyRules = preloadedRules ? preloadedRules : await getPropertyRules();
    let propertyName = propertyRules.propertyName;
    let propertyVersion = propertyRules.propertyVersion;

    await console.log('processing rules for property ' + propertyName + ' v' + propertyVersion);

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

    let ruleConf = '\n-- ### Property Rules : generated from ';
    ruleConf +=  config.localPapiJsonPath ? 'local: ' + config.localPapiJsonPath : 'api: ' + getPapiUrl() + ' ###';
    ruleConf += '\n' + defaultRule.process() + '\n';

    // dynamically construct a lua mapping function based on declared property vars
    let luaVarMap = buildLuaVarMap(propertyRules);

    // translate the js valueMap into a lua map - used for host header translation in origin behavior
    let luaValueMap = buildLuaValueMap(valueMap);

    // load some utils and vars
    let utilFunctions = fs.readFileSync(__dirname + '/../../lua/utils.lua', 'utf8');

    // load some utils and vars
    let akamaiFunctions = fs.readFileSync(__dirname + '/../../lua/akamaiFunctions.lua', 'utf8');

    // concat all lua
    let luaConf = utilFunctions + luaValueMap + luaVarMap + akamaiFunctions + ruleConf + 'finalActions()';

    // create empty file and write
    fs.closeSync(fs.openSync(config.outPutFile, 'w'));
    fs.writeFileSync(config.outPutFile, luaConf, 'utf8');

    await console.log('processing completed for property ' + propertyName + ' v' + propertyVersion);

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
