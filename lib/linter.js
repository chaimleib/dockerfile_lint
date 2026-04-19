'use strict';

const helper = require('./linter-utils'),
    parser = require('./parser'),
    loadRules = require('./rulefile-loader').load,
    logger = require('./logger'),
    _ = require('lodash');

//TODO move to utils
function printObject(obj) {
    return JSON.stringify(obj, null, 2)
}

function finish(result) {
    return result;
}

const commandValidators = {
    'LABEL': helper.validateNameVals,
    'ARG': helper.validateNameVals,
    'ENV': helper.validateNameVals
};


function validateCommand(command, context, result) {
    if (command.error) {
        helper.addError(result, command.lineno, command.raw, command.error,null);
    }
    const rules = context.rules;
    //Check if command is a valid Dockerfile command
    logger.debug("Checking command : " + command.name);
    const isValid = context.validInstructionsRegex.test(command.raw);
    if (!isValid) {
        helper.addError(result, command.lineno, command.raw, 'Invalid instruction',null);
        return false;
    }
    const instruction = command.name.trim().toUpperCase();
    // Update existence hash for later check
    if (instruction in context.requiredInstructions) {
        context.requiredInstructions[instruction].exists = true;
    }
    helper.checkLineRules(rules, instruction, command.raw, command.lineno, result);
    if (rules.line_rules[instruction] && rules.line_rules[instruction].paramSyntaxRegex) {
        const stringParams = command.raw.replace(instruction, '').trim();
        const validParams = rules.line_rules[instruction].paramSyntaxRegex.test(stringParams);
        if (!validParams) {
            helper.addError(result, command.lineno, command.raw, 'Invalid parameters for command.',null);
            return false;
        }
    }
    const commandValidatorFn = commandValidators[command.name];
    if (commandValidatorFn) {
        commandValidatorFn(command, context, result);
    }
}

/**
 * Create an instance of a linter object using the given rule file
 * @param ruleFilePath - the location of a rule file
 * @constructor
 */
function Linter(ruleFilePath) {
    if (!ruleFilePath) logger.info("No rule file provided, using default rules");
    this.rules = loadRules(ruleFilePath);
    helper.initLineRulesRegexes(this.rules);
}

/**
 * Return the profile section of the current rule file
 * @returns {}
 */
Linter.prototype.getProfile = function () {
    return this.rules.profile;
}


Linter.prototype.initContext = function(){
    const ruleCopy = _.cloneDeep(this.rules);
    this.context = {
        rules: ruleCopy,
        validInstructionsRegex: helper.createValidCommandRegex(ruleCopy.general.valid_instructions),
        requiredInstructions: helper.createReqInstructionHash(ruleCopy),
        requiredNameVals: helper.createRequiredNameValDict(ruleCopy)
    };
}

/**
 * Validate  dockerfile contents string and returns the array of analysis
 * results.
 *
 * The validate can be called safely multiple times with the same instance of
 * of the Linter
 *
 * @param contents {String}  The dockerfile file content.
 * @returns        {Array}
 */
Linter.prototype.validate = function (contents) {
    if (typeof contents !== 'string') {
        return finish([{
            message: 'Invalid type'
        }]);
    }
    const result = helper.newResult();
    this.initContext(); //start with a clean context to allow multiple calls.
    const options = {includeComments: false};
    const commands = parser.parse(contents, options);
    // @see  parser.parse for format of commands
    if (commands.length < 1) {
        helper.addError(result, 0, null,
            "Invalid Dockerfile. No commands found!",null);
        return finish(result);
    }
    if (commands[0].name == 'ARG') { //if Dockerfile starts with ARG skip FROM validation
       } else if (commands[0].name !== 'FROM') {
        helper.addError(result, commands[0].lineno, commands[0].raw,
            'Missing or misplaced FROM',null);
    }
    for (let i = 0; i < commands.length; i++) {
        validateCommand(commands[i], this.context, result);
    }
    helper.checkRequiredInstructions(this.context.requiredInstructions, result);
    helper.checkRequiredNameVals(this.context.requiredNameVals, result);
    return finish(result);
};


module.exports = Linter;
