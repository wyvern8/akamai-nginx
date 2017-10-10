import 'babel-polyfill';
import fs from 'fs';
import { setLocalConfig, setValueMap, setSkipBehaviors, generateConf } from './src/akamai-nginx.js';

(async function() {

    // to run locally against your papi json, run 'npm run configure'
    // and replace 'sample.papi.json' below with 'papiJson/your.property-v1.papi.json'
    setLocalConfig(
        'sample.papi.json',
        'lua/akamai.lua'
    );

    // map old to new values in generated lua based on local json (gitignored)
    let valueMap;
    if (fs.existsSync(__dirname + '/../valueMap.local.json')) {
        console.log('loading valueMap from valueMap.local.json');
        valueMap = JSON.parse(fs.readFileSync(__dirname + '/../valueMap.local.json', 'utf8'));
    } else {
        valueMap = [
            ['staging-old.akamai.com', 'origin'],
            ['origin.akamai-customer.com', 'origin']
        ];
    }
    setValueMap(
        new Map(valueMap)
    );

    // behaviours to skip altogether
    setSkipBehaviors([
        'webApplicationFirewall'
    ]);

    await generateConf();

    console.log('nginx config written to ./lua/akamai.lua');
})();