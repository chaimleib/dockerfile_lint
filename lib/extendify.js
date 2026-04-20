/**
 * Created by lphiri on 2/18/16.
 */
const _ = require('lodash');

const REPLACE = 'replace';
const CONCAT = 'concat';
const MERGE = 'merge';
const OR = 'or';
const AND = 'and';
const UNION = 'union'

const recoginize = {
    arrays: _.isArray,
    booleans: _.isBoolean,
    numbers: _.isNumber,
    strings: _.isString
};

function getFuncByBehaviour(behaviour) {
    switch (behaviour) {
        case REPLACE:
            return function(x, y) {
                return y;
            };
        case CONCAT:
            return function(x, y) {
                x = (_.isArray(x) || _.isString(x)) ? x : (_.isUndefined(x) ? [] : [x]);
                y = (_.isArray(y) || _.isString(y)) ? y : (_.isUndefined(y) ? [] : [y]);
                return x.concat(y);
            };
        case UNION:
            return function(x, y) {
                if (!_.isArray(x) && !_.isArray(y)) {
                    return undefined;
                }
                x = (_.isArray(x) || _.isString(x)) ? x : (_.isUndefined(x) ? [] : [x]);
                y = (_.isArray(y) || _.isString(y)) ? y : (_.isUndefined(y) ? [] : [y]);
                return _.union(x, y);
            };
        case MERGE:
            return undefined;
        case OR:
            return function(x, y) {
                return x || y;
            };
        case AND:
            return function(x, y) {
                return x && y;
            };
    }
}

function customizeExtend(options) {
    options = options || {};

    const inPlace = _.isUndefined(options.inPlace) ? true : options.inPlace;
    delete options.inPlace;

    const isDeep = _.isUndefined(options.isDeep) ? true : options.isDeep;
    delete options.isDeep;

    function customizeByOptions(x, y) {
        if (!isDeep && _.isPlainObject(y)) {
            return y;
        }

        for (const type in options) {
            if (recoginize[type](y)) {
                const customFunc = getFuncByBehaviour(options[type]);
                if (_.isFunction(customFunc)) {
                    return customFunc(x, y);
                }
                break;
            }
        }

        return undefined;
    }

    return function() {
        const newArguments = Array.prototype.slice.call(arguments);

        if (!inPlace) {
            newArguments[0] = (isDeep ? _.cloneDeep : _.clone)(arguments[0]);
        }

        newArguments.push(customizeByOptions);
        return _.mergeWith.apply(this, newArguments);
    }
}

module.exports = customizeExtend;
