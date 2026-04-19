'use strict';
const assert = require('node:assert/strict'),
    { describe, it } = require('node:test'),
    parser = require('../../lib/parser');


describe('parse function', function() {
    it('should correctly parse comments', function() {
        const options = {
            includeComments: true
        };
        const contents = 'FROM ubuntu:latest\n'
            + '#Comment1\n'
            + 'RUN echo done\n'
            + ' \n' //should ignore spaces
            + 'LABEL RUN docker run -it --rm --privileged -v `pwd`:/root/\\ \n'
            + '\n' //ignore empty space inside continuation line
            + '#Comment2\n'
            + ' --name NAME -e NAME=NAME -e IMAGE=IMAGE IMAGE dockerfile_lint -f Dockerfile \n'
            + '#Comment3 \n'
            + "LABEL two=3 'one two'=4";

        const commands = parser.parse(contents, options);
        // one less because of continuation line
        assert.strictEqual(commands.length, 7);
        assert.strictEqual(commands[1].name, 'COMMENT');
        assert.strictEqual(commands[1].args, '#Comment1');
        assert.strictEqual(commands[3].name, 'LABEL');
        // handle comments inside continuation line
        assert.deepStrictEqual(commands[3].args, {
            RUN: 'docker run -it --rm --privileged -v `pwd`:/root/ --name NAME -e NAME=NAME -e IMAGE=IMAGE IMAGE dockerfile_lint -f Dockerfile'
        });
        assert.strictEqual(commands[4].name, 'COMMENT');
        assert.strictEqual(commands[4].args, '#Comment2');
        assert.strictEqual(commands[5].name, 'COMMENT');
        assert.strictEqual(commands[5].args, '#Comment3');

    });

    it('should correctly strip out comments when asked to', function() {
        const options = {
            includeComments: false
        };
        const contents = 'FROM ubuntu:latest\n'
            + '#Comment1\n'
            + 'RUN echo done\n'
            + "LABEL two=3 'one two'=4 three="
            + '#Comment2\n'
            + '#Comment3 \n';
        const commands = parser.parse(contents, options);
        assert.strictEqual(commands.length, 3);

    });

    it('should correctly ignore commands preceded by an inline ignore', function() {
        const options = {
            includeComments: false
        };
        const contents = 'FROM ubuntu:latest\n'
            + '#Comment1\n'
            + '# dockerfile_lint - ignore\n'
            + 'RUN echo done\n'
            + "LABEL two=3 'one two'=4 three="
            + '#Comment2\n'
            + '#Comment3 \n';
        const commands = parser.parse(contents, options);
        assert.strictEqual(commands.length, 2);

    });

    it('should not ignore commands preceded by a comment about the inline ignore functionality', function() {
        const options = {
            includeComments: false
        };
        const contents = 'FROM ubuntu:latest\n'
            + '#Comment1\n'
            + '# dockerfile_lint comment about inline ignore\n'
            + 'RUN echo done\n'
            + "LABEL two=3 'one two'=4 three="
            + '#Comment2\n'
            + '#Comment3 \n';
        const commands = parser.parse(contents, options);
        assert.strictEqual(commands.length, 3);

    });

    describe('given a line with an invalid LABEL', function() {
        const options = {
            includeComments: false
        };
        it('should report error for that command', function() {
            const contents = 'FROM ubuntu:latest\n'
                + '#Comment1\n'
                + 'RUN echo done\n'
                + "LABEL two4";  //Invalid label
            const commands = parser.parse(contents, options);
            assert.ok(Object.hasOwn(commands[2], 'error'));
            assert.strictEqual(commands[2].error, 'LABEL must have two arguments, got two4');

        });

        it('should not report error for a valid LABEL following it', function() {
            const contents = 'FROM ubuntu:latest\n'
                + '#Comment1\n'
                + 'RUN echo done\n'
                + "LABEL two4\n" //Invalid label
                + "LABEL two=2";  //Valid label
            const commands = parser.parse(contents, options);
            assert.ok(Object.hasOwn(commands[2], 'error'));
            assert.ok(!Object.hasOwn(commands[3], 'error'));

        });
    });


});
