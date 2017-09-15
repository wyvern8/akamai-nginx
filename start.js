import 'babel-polyfill'
import EdgeGrid from 'edgegrid';
import dotenv from 'dotenv';
import { setApiConfig, setValueMap, setSkipBehaviors, generateConf } from './index.js';

(async function() {

    // load .env vars
    dotenv.config();

    const edgegrid = new EdgeGrid({
        path: process.env.AKA_EDGERC,
        section: 'default'
    });

    setApiConfig(
        edgegrid,
        process.env.AKA_CONTRACT_ID,
        process.env.AKA_GROUP_ID,
        process.env.AKA_PROPERTY_ID,
        process.env.AKA_PROPERTY_VERSION,
        __dirname + '/lua/akamai.lua'
    );

    setValueMap(
        new Map([
            ['oldVal', 'replacement']
        ])
    );

    setSkipBehaviors([
        'cpCode'
    ]);

    await generateConf().then(() => {
        console.log('done.')
    });
})();