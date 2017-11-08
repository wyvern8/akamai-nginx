## Contributing - adding criteria and behaviors

Fork this repository and work on your enhancements, then send a pull request.

Use commitizen for conventional commit messages via `git cz` instead of `git commit`.  
To setup if not already installed:
```
npm install -g commitizen
npm install -g cz-conventional-changelog
echo '{ "path": "cz-conventional-changelog" }' > ~/.czrc
```
..or you can just use `npm run commit` which will use local commitizen install.

The reason this approach is used is to automate the release process from travis to github and npm, based on the types of change being mapped to the corresponding http://semver.org/ version.

Support for new criteria and behaviors is done by adding new ES6 class files in:

```
src/criteria
src/behaviors
```
Each new feature should extend the corresponding base class and register itself using the name in the papi json response. 
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
- Notice that the 'register' function uses the name attribute from the papi json. This is important, because Behaviors and Criteria of a given Rule are applied by convention during processing of the PAPI json.
- The 'process' function should return the lua script string (or array of string lines) to be added to the akamai.lua conf, in order to simulate the relevant akamai behavior in nginx.

## Unit tests
`npm run test`

Please ensure that corresponding unit tests are created in:
```
test/criteria/*.spec.js
test/behaviors/*.spec.js
```
Each unit test should verify that the json options generate the correct lua script.

## Integration tests
To start the docker nginx containers and execute the integration tests use:

`npm run test-integration`

Please ensure that corresponding integration tests covering any new features are created in:
```
test/criteria/*.spec-int.js
test/behaviors/*.spec-int.js
```
Each integration test should verify the behavior/criteria results in the expected response from the docker-compose in this repo.

Framework has been put in place to generate lua config based on `/test/**/*.papi.json`.

The integration Lua config generated consists of predictable path criteria rules to enable targeting of behavior/criteria configs. These are generated based on the \*.papi.json files in the test directory.

Refer to test/_integration* and *.spec-int.js for details and examples.

Please note that due to the somewhat open-ended possible scenarios that a PAPI response could generate for nginx, this project relies on unit and integration tests to confirm that a given feature is 'working'.  

These tests are therefore a prerequisite for merge of any pull requests.  Feel free to create an issue for assitance.