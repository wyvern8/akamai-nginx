import { default as EdgeGrid } from 'edgegrid';
import { default as dotenv } from 'dotenv';

// load .env vars
dotenv.config();

const data = 'bodyData';
const eg = new EdgeGrid({
    path: process.env.AKA_EDGERC,
    section: 'default'
});

let context = {
    contractId: null,
    groupId: null
}

export function setContext(contractId, groupId) {
    context.contractId = contractId;
    context.groupId = groupId;
    return this;
}

function getContextQs() {
    return '?contractId=' + context.contractId + '&groupId=' + context.groupId;
}

export async function generateConf(propertyId, propertyVersion) {
    try {
        let propertyRules = await getPropertyRules(propertyId, propertyVersion);

        //todo walk rules and build nginx vhost

        return propertyRules;

    } catch (e) {
        console.log('akamai api request failed %o', e);
    }
}

async function getPropertyRules(propertyId, propertyVersion) {
    return new Promise(
        (resolve, reject) => {
            eg.auth({
                path: '/papi/v1/properties/' + propertyId + '/versions/' + propertyVersion + '/rules' + getContextQs(),
                method: 'GET',
                headers: {},
                body: data
            }).send(function (error, response, body) {
                console.log('akamai api response body: %o', body);
                resolve(body);
            });
        })
}
