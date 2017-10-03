import 'babel-polyfill';
import EdgeGrid from 'edgegrid';
import dotenv from 'dotenv';
import inquirer from 'inquirer';
import formatJson from 'format-json';
import fs from 'fs';

(async function() {

    // load .env vars
    dotenv.config();

    let papiResponses = new Map();

    const edgegrid = new EdgeGrid({
        path: process.env.AKA_EDGERC,
        section: 'default'
    });

    let contractId = await papiChoice(
        'Select Akamai contract:',
        '/papi/v1/contracts',
        'contracts', 'contractId', 'contractTypeName'
    );

    let groupId = await papiChoice(
        'Select Akamai property group:',
        '/papi/v1/groups/?contractId=' + contractId,
        'groups', 'groupId', 'groupName'
    );

    let propertyId = await papiChoice(
        'Select Akamai property:',
        '/papi/v1/properties/?contractId=' + contractId + '&groupId=' + groupId,
        'properties', 'propertyId', 'propertyName'
    );

    let latestVersion = papiResponses.get('properties').properties.items.filter((property) => {
        return property.propertyId === propertyId;
    })[0].latestVersion;

    // request property version
    let version = await inquirer.prompt([
        {
            type: 'input',
            name: 'version',
            message: 'The latest property verions is ' + latestVersion + ', which would you like?',
            default: latestVersion,
            validate: (version) => {
                if (parseInt(version) > 0 && parseInt(version) <= latestVersion) {
                    return true;
                } else {
                    return 'Please enter a valid version number.';
                }
            }

        }
    ]).then(function (answers) {
        console.log('selected version = ' + answers.version);
        return answers.version;
    });

    let propertyJson = await callPapi('property', '/papi/v1/properties/' +
            propertyId + '/versions/' + version +
            '/rules?contractId=' + contractId + '&groupId=' + groupId).then((data) => {
        return data;
    });

    let propertyName = papiResponses.get('properties').properties.items.filter((property) => {
        return property.propertyId === propertyId;
    })[0].propertyName;

    await inquirer.prompt([
        {
            type: 'confirm',
            name: 'outputToFile',
            message: 'Output property ' + propertyName + ' v' + version + ' json to file now?',
            default: true,

        }
    ]).then(function (answers) {
        console.log('selected outputToFile = ' + answers.outputToFile);
        if (answers.outputToFile) {
            let outputDir = __dirname + '/../papiJson';
            if (!fs.existsSync(outputDir)) {
                fs.mkdirSync(outputDir);
            }
            fs.writeFileSync(
                outputDir + '/' + propertyName + '-v' + version + '.papi.json',
                formatJson.plain(propertyJson), 'utf8'
            );
            console.log('\npapi json written to: ./papiJson/' + propertyName + '-v' + version + '.papi.json');
        }
    });

    console.log(
        '\n# ---------------------------------------------------------\n' +
        '# place the following in .env or set as shell/node env vars\n' +
        '# if you would like to use these parameters to configure nginx directly\n' +
        '# from api calls - otherwise point at the generated papi json.\n' +
        '# refer to start.js and start-local.js\n' +
        'AKA_CONTRACT_ID=' + contractId + '\n' +
        'AKA_GROUP_ID=' + groupId + '\n' +
        'AKA_PROPERTY_ID=' + propertyId + '\n' +
        'AKA_PROPERTY_VERSION=' + version + '\n'
    );

    async function papiChoice(message, papiUrl, containerField, valueField, nameField) {
        let choices = await callPapi(containerField, papiUrl).then((data) => {
            return data[containerField].items.map((item) => {
                let choice = {};
                choice.name = item[valueField] + ' ' + item[nameField];
                choice.value = item[valueField];
                return choice;
            });
        });

        return await inquirer.prompt([
            {
                type: 'list',
                name: valueField,
                message: message,
                paginated: true,
                choices: choices
            }
        ]).then(function (answers) {
            console.log('selected ' + valueField + ' = ' + answers[valueField]);
            return answers[valueField];
        });

    }

    async function callPapi(type, papiUrl) {
        return new Promise(
            (resolve, reject) => {
                console.log('calling papi url: ' + papiUrl + '\n');

                edgegrid.auth({
                    path: papiUrl,
                    method: 'GET'
                }).send((error, response, body) => {
                    if (error) {
                        return reject(error);
                    }
                    let jsonResult = JSON.parse(body);
                    papiResponses.set(type, jsonResult);
                    return resolve(jsonResult);
                });

            });
    }

})();