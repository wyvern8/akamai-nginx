import 'babel-polyfill';
import EdgeGrid from 'edgegrid';
import dotenv from 'dotenv';
import fs from 'fs';
import { setApiConfig, setValueMap, setSkipBehaviors, generateConf } from './src/akamai-nginx.js';

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

    // map old to new values in generated lua based on local json (gitignored)
    let valueMap;
    if (fs.existsSync(__dirname + '/../valueMap.local.json')) {
        console.log('loading valueMap from valueMap.local.json');
        valueMap = JSON.parse(fs.readFileSync(__dirname + '/../valueMap.local.json', 'utf8'));
    } else {
        valueMap = [
            ['oldVal', 'replacement']
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