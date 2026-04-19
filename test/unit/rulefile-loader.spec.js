'use strict';

const assert = require('node:assert/strict'),
    fs = require('node:fs'),
    { describe, it } = require('node:test'),
    loadRules = require('../../lib/rulefile-loader').load;


function loadJsonObject(filename) {
    const obj = JSON.parse(fs.readFileSync(filename, 'utf8'));
    return obj;
}


describe('rule file loader function', function() {

    it.skip('should throw an error when and incorrect rule specification is provided', function() {
        //Not implemented yet
    });

    it('should throw an error when there is a cyclic dependency', function() {
        assert.throws(
            loadRules.bind(null, './test/data/rules/loader_test_include_cyclic.yaml')
        );
    });

    it('should throw an error when a non-existent rule file is provided', function() {
        assert.throws(
            loadRules.bind(null, './test/data/rules/yoda.yaml')
        );
    });

    it('should throw an error when an included file is not found', function() {
        assert.throws(
            loadRules.bind(null, './test/data/rules/loader_test_include_non_exist.yaml')
        );
    });

    it('should correctly parse a rule file with multiple includes', function() {
        const rules = loadRules('./test/data/rules/loader_test_combine_main.yaml');
        const expected = loadJsonObject('./test/data/rules/loader_test_combine_main.expected.json');
        assert.deepStrictEqual(rules, expected);
    });

    it('should correctly load a rule file with an include chain', function() {
        //
        // We need to verify this : file B includes file A, file C includes file B, then loading
        // file C should load rules in the order A -> B -> C, with B overriding in values in A
        // and C overriding values in both A and B
        //
        const rules = loadRules('./test/data/rules/loader_test_include_chain.yaml');
        const expected = loadJsonObject('./test/data/rules/loader_test_include_chain.expected.json');
        assert.deepStrictEqual(rules, expected);
    });

});
