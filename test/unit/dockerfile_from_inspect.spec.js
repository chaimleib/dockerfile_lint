'use strict';

const assert = require('node:assert/strict'),
    { describe, it } = require('node:test'),
    { commandsFromInspect } = require('../../lib/inspect-to-dockerfile');

describe('Commands from Inspect function', function() {

    it('correctly parses labels', function() {
        const inspect = {
            Config: {
                "Labels": {
                    "Authoritative_Registry": "registry.redhat.com",
                    "BZComponent": "22222",
                    "VendorID": "12345"
                }
            }
        };
        const config = JSON.stringify(inspect);
        const commands = commandsFromInspect(config);
        assert.strictEqual(commands.length, 1);
        assert.strictEqual(commands[0].name, 'LABEL');
        assert.deepStrictEqual(commands[0].args, inspect.Config.Labels);
    });

    it('correctly parses user', function() {
        const inspect = { Config: { "User": "root" } };
        const config = JSON.stringify(inspect);
        const commands = commandsFromInspect(config);
        assert.strictEqual(commands.length, 1);
        assert.strictEqual(commands[0].name, 'USER');
        assert.strictEqual(commands[0].args, 'root');
    });

    it('correctly parses maintainer', function() {
        const inspect = { Author: "test@example.com" };
        const config = JSON.stringify(inspect);
        const commands = commandsFromInspect(config);
        assert.strictEqual(commands.length, 1);
        assert.strictEqual(commands[0].name, 'MAINTAINER');
        assert.strictEqual(commands[0].args, 'test@example.com');
    });

});
