require('babel-polyfill');
var akamaiNginx = require('akamai-nginx');
var fs = require('fs');

// example using local json. use setApiConfig for papi calls
akamaiNginx.setLocalConfig(
    require.resolve('akamai-nginx/sample.papi.json'),
    './akamai.lua' // output file
);

// map values such as origin hostnames
akamaiNginx.setValueMap(
    new Map([
        ['staging-old.akamai.com', 'staging-new.akamai.com'],
        ['origin.akamaicustomer.com', 'something.com']
    ])
);

// behaviours to skip altogether
akamaiNginx.setSkipBehaviors([
    'cpCode'
]);

// do it
akamaiNginx.generateConf().then(function() {
    var conf = fs.readFileSync('./akamai.lua');
    console.log(conf);
    console.log('done.');
});