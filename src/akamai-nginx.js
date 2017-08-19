import { default as EdgeGrid } from 'edgegrid';
import { default as dotenv } from 'dotenv';
dotenv.config();

const data = 'bodyData';
const eg = new EdgeGrid({
    path: process.env.AKA_EDGERC,
    section: 'default'
});

export async function generateConf(contractId, groupId, propertyId, propertyVersion) {
    try {
        let propertyRules = getPropertyRules(contractId, groupId, propertyId, propertyVersion);
        console.log('akamai api request: %o', propertyRules);
        return await propertyRules;

    } catch (e) {
        console.log('akamai api request failed %o', e);
    }
}

async function getPropertyRules(contractId, groupId, propertyId, propertyVersion) {
    return new Promise(
        (resolve, reject) => {
            eg.auth({
                path: '/papi/v1/properties/' + propertyId + '/versions/' + propertyVersion + '/rules?contractId=' + contractId + '&groupId=' + groupId,
                method: 'GET',
                headers: {},
                body: data
            }).send(function (error, response, body) {
                console.log('akamai api response body: %o', body);
                resolve(body);
            });
        })
}
