# akamai-nginx
configure nginx reverse proxy based on akamai property rules

## Install
`npm install akamai-nginx`

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

By default the directive 'lua_code_cache off;' is set in th nginx conf to allow generated lua 
to take effect without restarting nginx.  This directive should be disabled in a deployment as it has performance implications.

You can test that nginx is functioning using http://localhost/info which will output env info.

```docker-compose up```

## execution
set the following env var in .env or shell:

    AKA_EDGERC=/path/to/.edgerc
    
### example usage ES6
```javascript
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
````
## development
set the following env var in .env or shell to allow npm test to work

    AKA_CONTRACT_ID=ctr_XXXXXXXX
    AKA_GROUP_ID=grp_XXXXXXXX
    AKA_PROPERTY_ID=prp_XXXXXXXX
    AKA_PROPERTY_VERSION=XX

run `npm test` to confirm things are working.

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

    constructor(options) {
        super();
        this.options = options;
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
Please ensure that curresponding unit tests are created in:
```
test/criteria
test/behaviors
```
Each unit test should verify that the json options generate the correct lua script.