import { Criteria } from './criteria.js';
import { Behavior } from './behavior.js';

export class Rule {

    constructor(name, criteria, criteriaMustSatisfy, behaviors, children, skipBehaviors, valueMap, depth) {
        this.name = name;
        this.criteria = criteria;
        this.criteriaMustSatisfy = criteriaMustSatisfy;
        this.behaviors = behaviors;
        this.children = children;
        this.skipBehaviors = skipBehaviors;
        this.valueMap = valueMap;
        this.depth = depth;
    }

    process() {

        let result = '\n' + this.pad(this.depth) + '-- ' + this.name + ' rule ####';
        let criteriaNames = this.criteriaNames(this.criteria) ? this.criteriaNames(this.criteria) : 'none';
        result += '\n'  + this.pad(this.depth) + '-- criteria: ' + criteriaNames;

        if (this.criteriaNamesNotRegistered(this.criteria) !== '') {
            console.error('Criteria not registered: ' + this.criteriaNamesNotRegistered(this.criteria));
        }

        if (this.anyCriteriaForRuleRegistered(this.criteria)) {
            result += '\n' + this.pad(this.depth) + 'if ' + this.processCriteria(this.criteria, this.valueMap) + ' then';
        }

        if (this.behaviors && typeof this.behaviors !== 'undefined' && this.behaviors.length > 0) {
            result += this.pad(this.depth + 1) +
                this.processBehaviors(this.behaviors, this.valueMap, this.skipBehaviors) + '\n';
        }

        let that = this;
        this.children.forEach(function (childRule) {
            let rule = new Rule(
                childRule.name,
                childRule.criteria,
                childRule.criteriaMustSatisfy,
                childRule.behaviors,
                childRule.children,
                that.skipBehaviors,
                that.valueMap,
                that.depth + 1
            );
            result += rule.process();
        });

        if (this.anyCriteriaForRuleRegistered(this.criteria)) {
            result += this.pad(this.depth) + 'end\n';
        }

        return result;
    }

    anyCriteriaForRuleRegistered(criteria) {
        if (!criteria) return false;
        let anyCriteriaRegistered = false;
        criteria.forEach((criteria) => {
            if (Criteria.isRegistered(criteria.name)) {
                anyCriteriaRegistered = true;
            }
        });
        return anyCriteriaRegistered;
    }

    criteriaNames(criteria) {
        if (!criteria) return '';
        let criteriaNameArray = [];
        criteria.forEach((criteria) => {
            criteriaNameArray.push(criteria.name);
        });
        return '(' + criteriaNameArray.join(this.criteriaJoiner()) + ')';
    }

    criteriaNamesNotRegistered(criteria) {
        if (!criteria) return '';
        let criteriaNameArray = [];
        criteria.forEach((criteria) => {
            if (!Criteria.isRegistered(criteria.name)) {
                criteriaNameArray.push(criteria.name);
            }
        });
        return criteriaNameArray.join(', ');
    }

    processCriteria(criteria, valueMap) {
        if (!criteria) return null;
        let criteriaArray = [];
        criteria.forEach((criteria) => {
            if (Criteria.isRegistered(criteria.name)) {
                let item = new Criteria(criteria.name, criteria.options, valueMap);
                criteriaArray.push(item.process());
            }
        });
        return '(' + criteriaArray.join(this.criteriaJoiner()) + ')';
    }

    processBehaviors(behaviors, valueMap, skipBehaviors) {
        if (!behaviors) return null;
        let behaviorArray = [];
        behaviors.forEach((behavior) => {
            let item = new Behavior(behavior.name, behavior.options, valueMap);

            if (skipBehaviors.includes(behavior.name)) {
                behaviorArray.push('-- ' + behavior.name + ' behavior (skipped)');

            } else {
                behaviorArray.push('-- ' + behavior.name + ' behavior');
                let behaviourResult = item.process();
                if (behaviourResult) {
                    if (Array.isArray(behaviourResult)) {
                        behaviorArray = [...behaviorArray, ...behaviourResult];
                    } else {
                        behaviorArray.push(behaviourResult);
                    }
                }
            }

        });
        return '\n' + this.pad(this.depth+1) + behaviorArray.join('\n' + this.pad(this.depth+1));
    }

    criteriaJoiner() {
        let joiner = ') and (';

        switch (this.criteriaMustSatisfy) {
        case 'all':
            joiner = ') and (';
            break;
        case 'any':
            joiner = ') or (';
            break;
        }
        return joiner;
    }

    pad(count) {
        if (!count || count <0) {count=0;}
        return (new Array(count + 1)).join('\t');
    }

}