'use strict';

// const assert = require('node:assert/strict'),
//     { describe, it } = require('node:test'),
//     utils = require('../../lib/linter-utils');
//
// function assertObject(obj) {
//     assert.ok(obj !== null, 'Expected object to be non-null');
//     assert.strictEqual(typeof obj, 'object', 'Expected type of object to be "object"');
// }
//
// describe('createReqInstructionHash function', function() {
//     it('should parse a multiple label string', function() {
//         const labels = "vendor=devif";
//         const obj = utils.parseLabels(labels);
//         assertObject(obj);
//         console.log(obj);
//     });
//     it('should parse a single label string', function() {
//         const labels = "vendor=lindani phiri  vendor2=lindai zulu";
//         const obj = utils.parseLabels(labels);
//         assertObject(obj);
//         console.log(obj);
//     });
//     it('should throw an exception when the label string is invalid', function() {
//         const labels = "vendor=lindani phiri  vendor2=lindai zulu";
//         const obj = utils.parseLabels.bind(null, labels);
//         console.log(obj);
//     });
// });
//
// describe('createRequiredLabelsHash function', function() {
//     it('should parse a multiple label string', function() {
//         const labels = "vendor=devif";
//         const obj = utils.parseLabels(labels);
//         assertObject(obj);
//         console.log(obj);
//     });
//     it('should parse a single label string', function() {
//         const labels = "vendor=lindani phiri  vendor2=lindai zulu";
//         const obj = utils.parseLabels(labels);
//         assertObject(obj);
//         console.log(obj);
//     });
//     it('should throw an exception when the label string is invalid', function() {
//         const labels = "vendor=lindani phiri  vendor2=lindai zulu";
//         const obj = utils.parseLabels(labels);
//         console.log(obj);
//     });
// });
//
// describe('initLineRulesRegexes function', function() {
//     it('should parse a multiple label string', function() {
//         const labels = "vendor=devif";
//         const obj = utils.parseLabels(labels);
//         assertObject(obj);
//         console.log(obj);
//     });
//     it('should parse a single label string', function() {
//         const labels = "vendor=lindani phiri  vendor2=lindai zulu";
//         const obj = utils.parseLabels(labels);
//         assertObject(obj);
//         console.log(obj);
//     });
//     it('should throw an exception when the label string is invalid', function() {
//         const labels = "vendor=lindani phiri  vendor2=lindai zulu";
//         const obj = utils.parseLabels(labels);
//         console.log(obj);
//     });
// });
//
// describe('checkRequiredInstructions function', function() {
//     it('should parse a multiple label string', function() {
//         const labels = "vendor=devif";
//         const obj = utils.parseLabels(labels);
//         assertObject(obj);
//         console.log(obj);
//     });
//     it('should parse a single label string', function() {
//         const labels = "vendor=lindani phiri  vendor2=lindai zulu";
//         const obj = utils.parseLabels(labels);
//         assertObject(obj);
//         console.log(obj);
//     });
//     it('should throw an exception when the label string is invalid', function() {
//         const labels = "vendor=lindani phiri  vendor2=lindai zulu";
//         const obj = utils.parseLabels(labels);
//         console.log(obj);
//     });
// });
//
//
// describe('checkRequiredNameVals function', function() {
//     it('should parse a multiple label string', function() {
//         const labels = "vendor=devif";
//         const obj = utils.parseLabels(labels);
//         assertObject(obj);
//         console.log(obj);
//     });
//     it('should parse a single label string', function() {
//         const labels = "vendor=lindani phiri  vendor2=lindai zulu";
//         const obj = utils.parseLabels(labels);
//         assertObject(obj);
//         console.log(obj);
//     });
//     it('should throw an exception when the label string is invalid', function() {
//         const labels = "vendor=lindani phiri  vendor2=lindai zulu";
//         const obj = utils.parseLabels(labels);
//         console.log(obj);
//     });
// });
//
//
// describe('checkLineRules function', function() {
//     it('should parse a multiple label string', function() {
//         const labels = "vendor=devif";
//         const obj = utils.parseLabels(labels);
//         assertObject(obj);
//         console.log(obj);
//     });
//     it('should parse a single label string', function() {
//         const labels = "vendor=lindani phiri  vendor2=lindai zulu";
//         const obj = utils.parseLabels(labels);
//         assertObject(obj);
//         console.log(obj);
//     });
//     it('should throw an exception when the label string is invalid', function() {
//         const labels = "vendor=lindani phiri  vendor2=lindai zulu";
//         const obj = utils.parseLabels(labels);
//         console.log(obj);
//     });
// });
//
//
// describe('createValidCommandRegex function', function() {
//     it('should parse a multiple label string', function() {
//         const labels = "vendor=devif";
//         const obj = utils.parseLabels(labels);
//         assertObject(obj);
//         console.log(obj);
//     });
//     it('should parse a single label string', function() {
//         const labels = "vendor=lindani phiri  vendor2=lindai zulu";
//         const obj = utils.parseLabels(labels);
//         assertObject(obj);
//         console.log(obj);
//     });
//     it('should throw an exception when the label string is invalid', function() {
//         const labels = "vendor=lindani phiri  vendor2=lindai zulu";
//         const obj = utils.parseLabels(labels);
//         console.log(obj);
//     });
// });
//
// describe('findKeyValRule function', function() {
//     it('should parse a multiple label string', function() {
//         const labels = "vendor=devif";
//         const obj = utils.parseLabels(labels);
//         assertObject(obj);
//         console.log(obj);
//     });
//     it('should parse a single label string', function() {
//         const labels = "vendor=lindani phiri  vendor2=lindai zulu";
//         const obj = utils.parseLabels(labels);
//         assertObject(obj);
//         console.log(obj);
//     });
//     it('should throw an exception when the label string is invalid', function() {
//         const labels = "vendor=lindani phiri  vendor2=lindai zulu";
//         const obj = utils.parseLabels(labels);
//         console.log(obj);
//     });
// });
//
// describe('addResult function', function() {
//     it('should parse a multiple label string', function() {
//         const labels = "vendor=devif";
//         const obj = utils.parseLabels(labels);
//         assertObject(obj);
//         console.log(obj);
//     });
//     it('should parse a single label string', function() {
//         const labels = "vendor=lindani phiri  vendor2=lindai zulu";
//         const obj = utils.parseLabels(labels);
//         assertObject(obj);
//         console.log(obj);
//     });
//     it('should throw an exception when the label string is invalid', function() {
//         const labels = "vendor=lindani phiri  vendor2=lindai zulu";
//         const obj = utils.parseLabels(labels);
//         console.log(obj);
//     });
// });
//
// describe('addError function', function() {
//     it('should parse a multiple label string', function() {
//         const labels = "vendor=devif";
//         const obj = utils.parseLabels(labels);
//         assertObject(obj);
//         console.log(obj);
//     });
//     it('should parse a single label string', function() {
//         const labels = "vendor=lindani phiri  vendor2=lindai zulu";
//         const obj = utils.parseLabels(labels);
//         assertObject(obj);
//         console.log(obj);
//     });
//     it('should throw an exception when the label string is invalid', function() {
//         const labels = "vendor=lindani phiri  vendor2=lindai zulu";
//         const obj = utils.parseLabels(labels);
//         console.log(obj);
//     });
// });
//
// describe('validateNameValRule function', function() {
//     it('should parse a multiple label string', function() {
//         const labels = "vendor=devif";
//         const obj = utils.parseLabels(labels);
//         assertObject(obj);
//         console.log(obj);
//     });
//     it('should parse a single label string', function() {
//         const labels = "vendor=lindani phiri  vendor2=lindai zulu";
//         const obj = utils.parseLabels(labels);
//         assertObject(obj);
//         console.log(obj);
//     });
//     it('should throw an exception when the label string is invalid', function() {
//         const labels = "vendor=lindani phiri  vendor2=lindai zulu";
//         const obj = utils.parseLabels(labels);
//         console.log(obj);
//     });
// });
//
// describe('validateLabels function', function() {
//     it('should parse a multiple label string', function() {
//         const labels = "vendor=devif";
//         const obj = utils.parseLabels(labels);
//         assertObject(obj);
//         console.log(obj);
//     });
//     it('should parse a single label string', function() {
//         const labels = "vendor=lindani phiri  vendor2=lindai zulu";
//         const obj = utils.parseLabels(labels);
//         assertObject(obj);
//         console.log(obj);
//     });
//     it('should throw an exception when the label string is invalid', function() {
//         const labels = "vendor=lindani phiri  vendor2=lindai zulu";
//         const obj = utils.parseLabels(labels);
//         console.log(obj);
//     });
// });
