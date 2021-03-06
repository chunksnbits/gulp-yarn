/* jshint camelcase: false, strict: false */
/* global describe, beforeEach, it */

var chai = require('chai');
var should = chai.should();
var util = require('util');
var gutil = require('gulp-util');
var path = require('path');
var commandRunner = require('../lib/commandRunner');
var yarn = require('../index');
var args = process.argv.slice();

function fixture(file) {
    var filepath = path.join(__dirname, file);
    return new gutil.File({
        path: filepath,
        cwd: __dirname,
        base: path.join(__dirname, path.dirname(file)),
        contents: null
    });
}

var originalRun;

describe('gulp-yarn', function () {
    beforeEach(function () {
        originalRun = commandRunner.run;
        commandRunner.run = mockRunner();
        process.argv = args;
    });

    afterEach(function () {
        commandRunner.run = originalRun;
    });

    it('should run `yarn` if stream contains `package.json`', function (done) {
        var file = fixture('package.json');

        var stream = yarn();

        stream.on('error', function (err) {
            should.exist(err);
            done(err);
        });

        stream.on('data', function () {
        });

        stream.on('end', function () {
            commandRunner.run.called.should.equal(1);
            commandRunner.run.commands[0].cmd.should.equal('yarn');
            commandRunner.run.commands[0].args.should.eql([]);
            done();
        });

        stream.write(file);

        stream.end();
    });

    it('should run `yarn --production` if stream contains `package.json` and `production` option is set', function (done) {
        var file = fixture('package.json');

        var stream = yarn({production: true});

        stream.on('error', function (err) {
            should.exist(err);
            done(err);
        });

        stream.on('data', function () {
        });

        stream.on('end', function () {
            commandRunner.run.called.should.equal(1);
            commandRunner.run.commands[0].cmd.should.equal('yarn');
            commandRunner.run.commands[0].args.should.eql(['--production']);
            done();
        });

        stream.write(file);

        stream.end();
    });

    it('should run `yarn --flat` if stream contains `package.json` and `flat` option is set', function (done) {
        var file = fixture('package.json');

        var stream = yarn({flat: true});

        stream.on('error', function (err) {
            should.exist(err);
            done(err);
        });

        stream.on('data', function () {
        });

        stream.on('end', function () {
            commandRunner.run.called.should.equal(1);
            commandRunner.run.commands[0].cmd.should.equal('yarn');
            commandRunner.run.commands[0].args.should.eql(['--flat']);
            done();
        });

        stream.write(file);

        stream.end();
    });

    it('should run `yarn --dev` if stream contains `package.json` and `dev` option is set', function (done) {
        var file = fixture('package.json');

        var stream = yarn({dev: true});

        stream.on('error', function (err) {
            should.exist(err);
            done(err);
        });

        stream.on('data', function () {
        });

        stream.on('end', function () {
            commandRunner.run.called.should.equal(1);
            commandRunner.run.commands[0].cmd.should.equal('yarn');
            commandRunner.run.commands[0].args.should.eql(['--dev']);
            done();
        });

        stream.write(file);

        stream.end();
    });

    it('should run `yarn --force` if stream contains `package.json` and `force` option is set', function (done) {
        var file = fixture('package.json');

        var stream = yarn({force: true});

        stream.on('error', function (err) {
            should.exist(err);
            done(err);
        });

        stream.on('data', function () {
        });

        stream.on('end', function () {
            commandRunner.run.called.should.equal(1);
            commandRunner.run.commands[0].cmd.should.equal('yarn');
            commandRunner.run.commands[0].args.should.eql(['--force']);
            done();
        });

        stream.write(file);

        stream.end();
    });

    it('should run `yarn --production --flat`', function (done) {
        var file = fixture('package.json');

        var stream = yarn({
            production: true,
            flat: true
        });

        stream.on('error', function (err) {
            should.exist(err);
            done(err);
        });

        stream.on('data', function () {
        });

        stream.on('end', function () {
            commandRunner.run.called.should.equal(1);
            commandRunner.run.commands[0].cmd.should.equal('yarn');
            commandRunner.run.commands[0].args.should.eql(['--production', '--flat']);
            done();
        });

        stream.write(file);

        stream.end();
    });
});

function mockRunner() {
    var mock = function mock(cmd, cb) {
        mock.called += 1;
        mock.commands.push(cmd);
        cb();
    };
    mock.called = 0;
    mock.commands = [];
    return mock;
}
