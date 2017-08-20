# akamai-nginx
configure nginx reverse proxy based on akamai property rules

## install
`npm install akamai-nginx`

## setup papi
1. install https://github.com/akamai/httpie-edgegrid 
setup your .edgerc and test api calls are working.

2. use httpie to obtain your contractId, groupId and 
a propertyId via api calls 
https://developer.akamai.com/api/luna/papi/resources.html

## setup nginx and ansible
[TODO]

## execution
set the following env var in .env or shell:

    AKA_EDGERC=/path/to/.edgerc
    
### example usage ES6
```javascript
import { setContext, generateConf } from 'akamai-nginx';
...
async function getConf() {
    setContext(
        process.env.AKA_CONTRACT_ID,
        process.env.AKA_GROUP_ID
    )
    
    let nginxConf = await generateConf(
        process.env.AKA_PROPERTY_ID,
        process.env.AKA_PROPERTY_VERSION
    );
    
    return nginxConf;
}
````
## development
set the following env var in .env or shell to allow npm test to work

    AKA_CONTRACT_ID=ctr_XXXXXXXX
    AKA_GROUP_ID=grp_XXXXXXXX
    AKA_PROPERTY_ID=prp_XXXXXXXX
    AKA_PROPERTY_VERSION=XX

run `npm test` to confirm things are working.


