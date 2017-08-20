// Instrument the tests
import { default as assert } from 'assert';

// Libraries
import { setContext, generateConf } from '../src/akamai-nginx.js';

let test_conf = null;

describe('AkamaiNginx', function() {
    describe('generate config', function() {
        it('should find the default rule.', async function() {
            let expected_conf = 'default';

            setContext(
                process.env.AKA_CONTRACT_ID,
                process.env.AKA_GROUP_ID
            );

            let test_conf = await generateConf(
                process.env.AKA_PROPERTY_ID,
                process.env.AKA_PROPERTY_VERSION
            );

            test_conf = JSON.parse(test_conf).rules.name;
            console.log('result: ' + test_conf);
            assert.equal(test_conf, expected_conf);
        });
    });

});