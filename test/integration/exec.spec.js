'use strict';
process.env.NODE_ENV = 'test';

const assert = require('node:assert/strict'),
    { exec } = require('node:child_process'),
    fs = require('node:fs'),
    http = require('node:http'),
    path = require('node:path'),
    { describe, it } = require('node:test'),
    parser = require('fast-xml-parser');

const binScript = path.join('bin', 'dockerfile_lint')

describe('The dockerfile_lint command', function() {

    it('should allow a valid Dockerfile', function(t, done) {

        exec('node ' + binScript + ' -f ./test/data/dockerfiles/TestLabels',
            function(err, stdout, stderr) {
                if (err) {
                    return done(err);
                }
                assert.strictEqual(stdout.trim(), '# Analyzing ./test/data/dockerfiles/TestLabels\n\nCheck passed!');
                assert.strictEqual(stderr, '');
                done();
            });
    });

    it('should validate a Dockerfile via http', function(t, done) {
        const testPath = 'test/data/dockerfiles/TestLabels';
        // Create an ephemeral HTTP server to serve the Dockerfile.
        // Doing a request over the internet to
        // https://raw.githubusercontent.com/ is possible,
        // but can lead to flaky tests due to network issues like timeouts.
        // It's also more consistent to use a file from the same git commit.
        const server = http.createServer((req, res) => {
            if (req.url !== `/${testPath}`) {
                res.writeHead(404, { 'Content-Type': 'text/plain' });
                res.end('Not Found');
                return;
            }

            const repoDir = path.dirname(path.dirname(__dirname));
            const filePath = path.join(repoDir, testPath);
            const stat = fs.statSync(filePath);
            assert.ok(stat.isFile(), 'Expected a file at ' + filePath);
            res.writeHead(200, {
                'Content-Type': 'text/plain',
                'Content-Length': stat.size,
            });
            const readStream = fs.createReadStream(filePath);
            readStream.pipe(res);
        });
        const port = 3000;
        server.listen(port);

        const url = `http://localhost:${port}/${testPath}`;
        exec(`node ${binScript} -r config/base_rules.yaml -f ${url}`,
            function(err, stdout, stderr) {
                server.close();
                if (err) {
                    return done(err);
                }
                assert.strictEqual(stdout.trim(), `# Analyzing ${url}\n\nCheck passed!`);
                assert.strictEqual(stderr, '');
                done();
            });
    });



    it('should exit with a non-zero error code on an empty file', function(t, done) {
        var p = exec('node ' + binScript + ' -f test/data/dockerfiles/EmptyFile -r test/data/rules/basic.yaml',
            function(err, stdout, stderr) {
            });
        p.on('exit', function(code) {
            assert.strictEqual(code, 5); // 4 errors + 1 warning
            done();
        });

    });

    it('should exit with code 0 on warning when in strict mode ', function(t, done) {
        var p = exec('node ' + binScript + ' -p -f test/data/dockerfiles/TestLabels -r test/data/rules/basic.yaml',
            function(err, stdout, stderr) {
            });
        p.on('exit', function(code) {
            assert.strictEqual(code, 0);
            done();
        });

    });

    it('should exit with code 0 on warning when in permissive mode (long form)', function(t, done) {
        var p = exec('node ' + binScript + ' --permissive -f test/data/dockerfiles/TestLabels -r test/data/rules/basic.yaml',
            function(err, stdout, stderr) {
            });
        p.on('exit', function(code) {
            assert.strictEqual(code, 0);
            done();
        });

    });

    it('should exit with code 1 on warning when not in permissive mode ', function(t, done) {
        var p = exec('node ' + binScript + ' -f test/data/dockerfiles/TestLabels -r test/data/rules/basic.yaml',
            function(err, stdout, stderr) {
            });
        p.on('exit', function(code) {
            assert.strictEqual(code, 1);
            done();
        });
    });


    it('should output valid JSON when in --json mode with multiple Dockerfiles', function(t, done) {
        var p = exec('node ' + binScript + ' --json -f test/data/dockerfiles/TestLabels -f test/data/dockerfiles/TestLabels -p -r test/data/rules/basic.yaml',
            function(err, stdout, stderr) {
                const parsed = JSON.parse(stdout);
                assert.ok(parsed);
                assert.strictEqual(parsed.length, 2);
            });
        p.on('exit', function(code) {
            assert.strictEqual(code, 0);
            done();
        });
    });

    it('should exit with code 1 and error message when using both --json and --junit options ', function(t, done) {
        var p = exec('node ' + binScript + ' --junit --json -f test/data/dockerfiles/TestLabels',
            function(err, stdout, stderr) {
                assert.strictEqual(stderr, "ERROR: result format options (\"--json and --junit\") cannot be used together, please choose one only\n");
            });
        p.on('exit', function(code) {
            assert.strictEqual(code, 1);
            done();
        });
    });

    it('should output valid XML when in --junit mode', function(t, done) {
        var p = exec('node ' + binScript + ' --junit -f test/data/dockerfiles/TestLabels -p -r test/data/rules/basic.yaml',
            function(err, stdout, stderr) {
                assert.ok(parser.validate(stdout));
            });
        p.on('exit', function(code) {
            assert.strictEqual(code, 0);
            done();
        });
    });


});
