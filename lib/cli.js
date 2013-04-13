/*jshint evil: true, indent: 4, node: true */
/**
 * doxit
 *
 * The stupid JavaScript documentation generator.
 *
 * @author Shannon Moeller <me@shannonmoeller.com>
 * @version 1.1.1
 */

'use strict';

// Modules
var cmdr = require('commander');
var copier = require('copier');
var fs = require('fs');
var doxit = require('./doxit');

// Split on commas
var csv = function(string) {
    return string.split(',');
};

// Setup cli
cmdr.version('1.1.1')
    .usage('[options] (glob ...)')
    .option('-c, --config [file]', 'a javascript or json file containing options to use')
    .option('-d, --ignore-dirs [regex]', 'regex of directories to ignore [\\.git|\\.svn|node_modules]', RegExp, /\.git|\.svn|node_modules/)
    .option('-f, --ignore-files [regex]', 'regex of files to ignore [^_|^\\.|~$]', RegExp, /^_|^\.|~$/)
    .option('-i, --input [glob]', 'comma-separated list of glob patterns matching files and directories to document', csv)
    .option('-I, --index [file]', 'which file to treat as the default', String)
    .option('-o, --output [dir]', 'output directory [./docs]', String, './docs')
    .option('-t, --title [string]', 'title of the documentation [Documentation]', String, 'Documentation')
    .option('-T, --template [file]', 'jade template to use', String, __dirname + '/../templates/default/index.jade')
    .parse(process.argv);

// Merge in config options
if (cmdr.config) {
    try { copier(cmdr, eval(fs.readFileSync(cmdr.config, 'utf8'))); }
    catch (e) {}
}

// Push configured input onto args
if (cmdr.input) {
    cmdr.args = cmdr.args.concat(cmdr.input);
}

// Default args to current directory
if (!cmdr.args.length) {
    cmdr.args.push('\*\*/\*.{js,md,html}');
}

// Execute doxit
doxit(cmdr.args, cmdr);
