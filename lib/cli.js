/*jshint evil: true, indent: 4, node: true */
/**
 * doxit
 *
 * The stupid documentation generator.
 *
 * @author Shannon Moeller <me@shannonmoeller.com>
 * @version 1.1.0
 */
'use strict';

// Modules
var copier = require('copier');
var doxit = require('./doxit');
var fs = require('fs');
var glob = require('glob');
var opts = require('commander');
var path = require('path');

// Split a comma-separated list
var csv = function (list) {
    return list && list.split(',');
};

// Merge config file contents into options
var mergeConfig = function (opts) {
    try {
        var config = opts.config;
        config = path.resolve(config);
        config = fs.readFileSync(config, 'utf8');
        config = eval('(' + config + ')');
        return copier(opts, config);
    } catch (e) {
        return opts;
    }
};

// Glob arguments and concat results
var reduceGlob = function (ret, arg) {
    return ret.concat(glob.sync(arg));
};

// Setup cli
opts.version('1.1.0')
    .usage('[options] (glob ...)')
    .option('-c, --config [file]', 'a javascript or json file containing options to use')
    .option('-d, --ignore-dirs [regex]', 'regular expression matching directories to ignore [\\.git|\\.svn|node_modules]', RegExp, /\.git|\.svn|node_modules/)
    .option('-f, --ignore-files [regex]', 'regular expression matching files to ignore [^_|^\\.|~$]', RegExp, /^_|^\.|~$/)
    .option('-i, --input [glob]', 'comma-separated list of glob patterns matching files and directories to document', csv)
    .option('-I, --index [file]', 'which file to treat as the default', String)
    .option('-o, --output [dir]', 'output directory [./docs]', String, './docs')
    .option('-t, --title [string]', 'title of the documentation [Documentation]', String, 'Documentation')
    .option('-T, --template [file]', 'jade template to use', String, __dirname + '/../templates/default/index.jade')
    .parse(process.argv);

// Merge in config options
if (opts.config) {
    opts = mergeConfig(opts);
}

// Push input onto args
if (opts.input) {
    opts.args = opts.args.concat(opts.input);
}

// Default args to current directory
if (!opts.args.length) {
    opts.args.push('\*\*/\*.{js,md,html}');
}

// Execute doxit
doxit(opts.args.reduce(reduceGlob, []), opts);
