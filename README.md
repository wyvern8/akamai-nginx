# Akamai-NGINX: CDN simulator

[![npm version](https://badge.fury.io/js/akamai-nginx.svg)](https://badge.fury.io/js/akamai-nginx)
[![Build Status](https://travis-ci.org/wyvern8/akamai-nginx.svg?branch=master)](https://travis-ci.org/wyvern8/akamai-nginx)
[![Code Climate](https://codeclimate.com/github/wyvern8/akamai-nginx/badges/gpa.svg)](https://codeclimate.com/github/wyvern8/akamai-nginx)
[![Test Coverage](https://codeclimate.com/github/wyvern8/akamai-nginx/badges/coverage.svg)](https://codeclimate.com/github/wyvern8/akamai-nginx/coverage)
[![Greenkeeper badge](https://badges.greenkeeper.io/wyvern8/akamai-nginx.svg)](https://greenkeeper.io/)
[![Commitizen friendly](https://img.shields.io/badge/commitizen-friendly-brightgreen.svg)](http://commitizen.github.io/cz-cli/)
[![semantic-release](https://img.shields.io/badge/%20%20%F0%9F%93%A6%F0%9F%9A%80-semantic--release-e10079.svg)](https://github.com/semantic-release/semantic-release)

Configure an nginx reverse proxy/simulator based on Akamai property rules (Unofficial)

This project takes an Akamai property api json response, and generates lua code integrated with nginx, in order to 
simulate an akamai property.  

<a href="https://github.com/wyvern8/akamai-nginx">
  <img src="https://raw.githubusercontent.com/wyvern8/akamai-nginx/master/logo.png?raw=true" alt="" title="logo" align="right" style="width:140px">
</a>

#### This can be useful for: 
- Local development on apps that rely on akamai property rules.
- Non prod environments that cannot be granted ingress from Akamai due to organization policy.
- On-demand temporarily provisioned environments to run CI tests against in pipelines.
- Learning the basic concepts of how a CDN works.

## Install
`npm install akamai-nginx`
    
Or clone this repository.

## Setup papi
1. Follow the instructions here to setup your .edgerc and test api calls are working. https://github.com/akamai/AkamaiOPEN-edgegrid-node 

2. Execute `npm run configure` in an interactive shell, and follow the prompts to retrieve your property json, or environment property values.  Select 'save json' to run offline - your property json will be placed in ./papiJson dir.  Refer to start.js .  Alternatively, add output values to your .env file or environment variables.

OR

2b. Use httpie to obtain your contractId, groupId and 
a propertyId via api calls yourself and set env vars.
https://developer.akamai.com/api/luna/papi/resources.html

## Nginx integration
It is recommended to install docker-compose and use the containers supplied in this repo start with. https://docs.docker.com/compose/install/

The following npm scripts can be used to control the containers if you are not familiar with docker:

```
npm run docker-start
npm run docker-stop
npm run docker-logs
```

The docker-compose.yml is used to start OpenResty containers to simulate an akamai property, edge and origin.
  
OpenResty ( https://openresty.org ) is a packaging of nginx with the required Lua modules built in.

This is done by mapping the local nginx-akamai.conf and lua directory into a docker container which is where most of the work is done.  

A second nginx container using nginx-edge.conf maintains the proxy cache, and a third acts as origin and has the nginx-origin.conf mapped.  

The request flow from client upstream is:

```client -> edgecache nginx -> akamai nginx -> origin nginx or other host```

By default the directive 'lua_code_cache off;' is set in the nginx-akamai.conf to allow generated lua 
to take effect without restarting nginx.  This directive should be disabled in a deployment as it has performance implications.

Use ```docker-compose up``` to start all containers, with localhost port 80 and 443 (self-signed) mapped to the 'akamai-edge' container. This will proxy requests to the akamai-nginx container, and on to origin. See note on caching below. Setting/mapping a property origin 
hostname as 'origin' will allow the akamai container to use the second container as origin for testing.  This mapping can be done using the setValueMap function.

You can test that all the containers are functioning using by executing the integration tests:

```npm run test-integration```

## Execution
After install, you can test without papi rest calls using the local json example using `npm run start-local`  or `npm test` to run unit tests.

To use an akamai property from your account, configure edgegrid, and set the following env var in .env or shell.  
The values can be obtained using  `npm run configure`:

    AKA_EDGERC=/path/to/.edgerc    
    AKA_CONTRACT_ID=ctr_XXXXXXXX
    AKA_GROUP_ID=grp_XXXXXXXX
    AKA_PROPERTY_ID=prp_XXXXXXXX
    AKA_PROPERTY_VERSION=XX
    
To process property rules into lua nginx config in the akamai docker container, either:

1. Use the local sample.papi.json file  `npm run start-local`  or your own papi json file.
2. Use your akamai api env to pull json at runtime, use  `npm run start`

Using the sample 'start.js' script directly after build, you can also pass parameters to control execution.

`AKA_MODE` : controls whether to run using local papiJson or papi api call. Either 'PAPI' or 'LOCAL'.

`AKA_LUA_OUTPUT_FILE` : output to a file other than lua/akamai.lua (not for local docker)

`AKA_PAPI_JSON_FILE` : path to local papiJson file to process_

Examples:

`AKA_MODE=PAPI AKA_LUA_OUTPUT_FILE=property.lua node dist/start.js`

`AKA_MODE=LOCAL AKA_PAPI_JSON_FILE=papiJson/dev-www.yoursite.com-v2.papi.json node dist/start.js`

### Example usage in a node app
```javascript
require('babel-polyfill');
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
..then assuming above is 'generate.js',  `node generate.js`  this will generate 'akamai.lua' in current dir.  
This in conjunction with the nginx.conf and docker-compose can be used to build your CDN simulator proxy.
    
### Example usage in ES6
```javascript
import 'babel-polyfill'
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

    await generateConf();
    
    console.log('done.');
    
})();
````

### Cache management
The Akamai 'caching' behavior is mapped to cache control response headers, with the TTLs from property configuration applied.   The TTL is represented as the standard nginx cache control 'X-Accel-Expires' response header.
  
A separate docker container 'edge' then controls reading and writing to an nginx proxy cache based on this response header from upstream. 

This is done in a separate 'edge' nginx docker instance, because at this time the proxy cache related directives in nginx cannot be 
parametrized based on lua processing results.  In some ways this hierarchy may actually be a closer approximation of edgeserver midgress. 

The cache directory from the docker container is mapped to the 'cache' directory local to the docker-compose.yml

To clear the cache you can clear out this directory, ie. one of:

`sudo rm -rf ./cache/*`

`npm run clearcache`

If you happen to have an nginx plus license, the purge capability could easily implemented.

To bypass the cache for a given request(s), either:
- add a querystring `?nocache=true`
- add a cookie `nocache=true`

## Contributing - adding criteria and behaviors
You are welcome to contribute to this project.  Take a look at the [Contribution Notes](CONTRIBUTING.md) 
to see how to get your changes merged in.
