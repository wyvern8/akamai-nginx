# akamai-nginx
Configure nginx reverse proxy/simulator based on Akamai property rules (Unofficial)

## Install
`npm install akamai-nginx` or clone repo

## Setup papi
1. install https://github.com/akamai/httpie-edgegrid 
setup your .edgerc and test api calls are working.

2. use httpie to obtain your contractId, groupId and 
a propertyId via api calls 
https://developer.akamai.com/api/luna/papi/resources.html

## nginx integration
The docker-compose.yml in this repo can be used to start an OpenResty container.  
OpenResty (https://openresty.org) is nginx with things such as the required Lua modules built in.
The docker-compose.yml maps the local nginx.conf and lua directory into the docker container.  

By default the directive 'lua_code_cache off;' is set in the nginx conf to allow generated lua 
to take effect without restarting nginx.  This directive should be disabled in a deployment as it has performance implications.

You can test that nginx is functioning using http://localhost/info which will output env info.

```docker-compose up```

## execution
set the following env var in .env or shell:

    AKA_EDGERC=/path/to/.edgerc
    
after `npm install akamai-nginx` you can use the following to execute:

### example usage
```javascript
var akamaiNginx = require('akamai-nginx');

// example using local json. use setApiConfig for papi calls
akamaiNginx.setLocalConfig(
    'node_modules/akamai-nginx/sample.papi.json',
    './akamai.lua' // output file
);

// map values such a origin hostnames
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
    console.log('done.')
});

```  
..then assuing above is 'generate.js', `node --require babel-polyfill generate.js` this will generate 'akamai.lua' in current dir.  
This in conjunction with the nginx.conf and docker-compose can be used to build your akamai simulator proxy.
    
### example usage ES6
```javascript
import EdgeGrid from 'edgegrid';
import dotenv from 'dotenv';
import { setApiConfig, setValueMap, setSkipBehaviors, generateConf } from 'akamai-nginx';

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
````
## development
set the following env var in .env or shell to allow npm test to work

    AKA_CONTRACT_ID=ctr_XXXXXXXX
    AKA_GROUP_ID=grp_XXXXXXXX
    AKA_PROPERTY_ID=prp_XXXXXXXX
    AKA_PROPERTY_VERSION=XX

run `npm test` to confirm things are working.

1. using the local sample.papi.json file `npm run start-local`
2. using your akamai api setup `npm run start` 

## adding criteria and behaviors
support for new criteria and behaviors can be achieved by adding new js files in:

```
src/criteria
src/behaviors

```
each new feature should extend the corresponding base class and register itself using the name in the papi json response. 
eg. for the 'origin' behavior at a basic level:

```typescript
import { Behavior } from '../behavior.js';

export class BehaviorOrigin extends Behavior {

    constructor(options, valueMap, skipBehaviors) {
        super();
        this.options = options;
        this.valueMap = valueMap;
        this.skipBehaviors = skipBehaviors;
    }

    process() {
        return 'ngx.var.origin = "' + this.options.hostname + '"';
    }
}
Behavior.register('origin', BehaviorOrigin);
```
- notice that the 'register' function uses the name attribute from the papi json.
- the 'process' function should return the lua script to be added to the akamai.lua conf to simulate the akamai behavior in nginx.

## Unit tests
Please ensure that corresponding unit tests are created in:
```
test/criteria
test/behaviors
```
Each unit test should verify that the json options generate the correct lua script.