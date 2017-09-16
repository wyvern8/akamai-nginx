import 'babel-polyfill'
import { setLocalConfig, setValueMap, setSkipBehaviors, generateConf } from './src/akamai-nginx.js';

(function() {
    setLocalConfig(
        __dirname + '/sample.papi.json',
        'lua/akamai.lua'
    );

    setValueMap(
        new Map([
            ['staging-old.akamai.com', 'origin'],
            ['origin.akamai-customer.com', 'origin']
        ])
    );

    setSkipBehaviors([
        'cpCode'
    ]);

    generateConf().then(() => {
        console.log('done.');
    });
})();