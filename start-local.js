import 'babel-polyfill'
import { setLocalConfig, setValueMap, setSkipBehaviors, generateConf } from './src/akamai-nginx.js';

(function() {

    // to run locally against your papi json, run 'npm run configure'
    // and replace 'sample.papi.json' below with 'papiJson/your.property-v1.papi.json'
    setLocalConfig(
        'sample.papi.json',
        'lua/akamai.lua'
    );

    // map old to new values in generated lua
    setValueMap(
        new Map([
            ['staging-old.akamai.com', 'origin'],
            ['origin.akamai-customer.com', 'origin']
        ])
    );

    // behaviours to skip altogether
    setSkipBehaviors([
        'webApplicationFirewall'
    ]);

    generateConf().then(() => {
        console.log('nginx config written to ./lua/akamai.lua');
    });
})();