import { Behavior } from '../behavior.js';

export class BehaviorRewriteUrl extends Behavior {

    constructor(options, valueMap) {
        super();
        this.options = options;
        this.valueMap = valueMap;
    }

    process() {

        let match = this.switchByVal({
            'REPLACE': '"' + this.options.match + '"',

        }, '"' + this.options.match + '"', this.options.behavior);

        let replacement = this.switchByVal({
            'REPLACE': '"' + this.options.targetPath + '"',

        }, '""', this.options.behavior);


        return [
            '-- ' + this.options.behavior + ' path part',
            'aka_origin_url = string.gsub(aka_request_path, ' + match + ', ' + replacement + ')',
            'if true == ' + this.options.keepQueryString + ' then',
            '\taka_origin_url = aka_origin_url .. aka_request_qs',
            'end'
        ];

    }
}
Behavior.register('rewriteUrl', BehaviorRewriteUrl);
