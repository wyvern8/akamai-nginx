import 'babel-polyfill'
import EdgeGrid from 'edgegrid';
import dotenv from 'dotenv';
import { setApiConfig, setValueMap, setSkipBehaviors, generateConf } from './index.js';

(async function() {

    // load .env vars
    dotenv.config();

    // assumes you have configured edgegrid
    const edgegrid = new EdgeGrid({
        path: process.env.AKA_EDGERC,
        section: 'default'
    });

    // assumes you have set env vars as output of 'npm run configure' or another method
    setApiConfig(
        edgegrid,
        process.env.AKA_CONTRACT_ID,
        process.env.AKA_GROUP_ID,
        process.env.AKA_PROPERTY_ID,
        process.env.AKA_PROPERTY_VERSION,
        'lua/akamai.lua'
    );

    // map old to new values in generated lua
    setValueMap(
        new Map([
            ['oldVal', 'replacement']
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