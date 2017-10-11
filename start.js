import 'babel-polyfill';
import EdgeGrid from 'edgegrid';
import dotenv from 'dotenv';
import fs from 'fs';
import { setLocalConfig, setApiConfig, setValueMap, setSkipBehaviors, generateConf } from './src/akamai-nginx.js';

(async function() {

    // load .env vars
    dotenv.config();

    let mode = process.env.AKA_MODE ? process.env.AKA_MODE.toUpperCase() : 'LOCAL';
    console.log('\n#### STARTING IN ' + mode + ' MODE ####');

    // lua output file
    let luaOutputFile = process.env.AKA_LUA_OUTPUT_FILE ? process.env.AKA_LUA_OUTPUT_FILE : 'lua/akamai.lua';

    if (process.env.AKA_MODE !== 'PAPI') {
        // to run locally against your papi json, run 'npm run configure'
        // and set env var AKA_PAPI_JSON_FILE to your json, eg. 'papiJson/your.property-v1.papi.json'
        // lua output file
        let localPapiJson = process.env.AKA_PAPI_JSON_FILE ? process.env.AKA_PAPI_JSON_FILE : 'sample.papi.json';

        setLocalConfig(
            localPapiJson,
            luaOutputFile
        );

    } else {
        // edgerc section name
        let edgercSection = process.env.AKA_EDGERC_SECTION ? process.env.AKA_EDGERC_SECTION : 'default';

        // assumes you have configured edgegrid
        const edgegrid = new EdgeGrid({
            path: process.env.AKA_EDGERC,
            section: edgercSection
        });

        // assumes you have set env vars as output of 'npm run configure' or another method
        setApiConfig(
            edgegrid,
            process.env.AKA_CONTRACT_ID,
            process.env.AKA_GROUP_ID,
            process.env.AKA_PROPERTY_ID,
            process.env.AKA_PROPERTY_VERSION,
            luaOutputFile
        );
    }

    // map old to new values in generated lua based on local json (gitignored)
    let valueMap = [
        ['staging-old.akamai.com', 'origin'],
        ['origin.akamai-customer.com', 'origin']
    ];

    if (fs.existsSync(__dirname + '/../valueMap.local.json')) {
        console.log('loading valueMap from valueMap.local.json');
        valueMap = JSON.parse(fs.readFileSync(__dirname + '/../valueMap.local.json', 'utf8'));
    }

    setValueMap(
        new Map(valueMap)
    );

    // behaviours to skip altogether
    setSkipBehaviors([
        'webApplicationFirewall'
    ]);

    await generateConf();

    console.log('nginx config written to ' + luaOutputFile);

})();