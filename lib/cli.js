/*jshint evil: true, indent: 4, node: true, white: true */
/**
 * doxit
 * =====
 *
 * The stupid documentation generator.
 *
 * Built with [dox][dox], [jade][jad], [Foundation][fdn], and [Prism][psm].
 *
 * [dox]: https://github.com/visionmedia/dox
 * [jad]: https://github.com/visionmedia/jade
 * [fdn]: https://github.com/zurb/foundation
 * [psm]: https://github.com/LeaVerou/prism
 *
 * Installation
 * ------------
 *
 * Via [npm][npm]:
 *
 *     $ npm install -g doxit
 *
 * [npm]: http://npmjs.org/
 *
 * Usage
 * -----
 *
 *     Usage: doxit [options] <file|dir ...>
 *
 *     Options:
 *
 *       -h, --help                    output usage information
 *       -V, --version                 output the version number
 *       -c, --config [file]           a javascript or json file containing options to use
 *       -d, --ignore-dirs [pattern]   regular expression matching directories to ignore [.git, .svn, node_modules]
 *       -e, --extensions [pattern]    regular expression matching the extensions of files to document [.coffee, .js, .md]
 *       -f, --ignore-files [pattern]  regular expression matching files to ignore [~*, _*, .*]
 *       -I, --index [file]            which file to treat as the default
 *       -o, --output [dir]            output directory [./docs]
 *       -t, --title [string]          title of the documentation [Documentation]
 *       -T, --template [file]         jade template to use
 *
 * @author Shannon Moeller <me@shannonmoeller.com>
 * @version 1.0.0
 */

'use strict';

// Modules
var copier = require('copier');
var doxit = require('./doxit');
var fs = require('fs');
var glob = require('glob');
var opts = require('commander');
var path = require('path');

// Properties
var config = null;

// Methods
var csv = function (list) {
    return list && list.split(',');
};

// Setup cli
opts.version('1.0.0')
    .usage('[options] <file|dir ...>')
    .option('-c, --config [file]', 'a javascript or json file containing options to use')
    .option('-d, --ignore-dirs [pattern]', 'regular expression matching directories to ignore [.git, .svn, node_modules]', RegExp, /\.git|\.svn|node_modules/)
    .option('-e, --extensions [pattern]', 'regular expression matching the extensions of files to document [.coffee, .js, .md]', RegExp, /\.coffee$|\.js$|\.md$/)
    .option('-f, --ignore-files [pattern]', 'regular expression matching files to ignore [~*, _*, .*]', RegExp, /^\~|^\_|^\./)
    .option('-I, --index [file]', 'which file to treat as the default', String)
    .option('-o, --output [dir]', 'output directory [./docs]', './docs', String)
    .option('-t, --title [string]', 'title of the documentation [Documentation]', String, 'Documentation')
    .option('-T, --template [file]', 'jade template to use', String, __dirname + '/../templates/default/index.jade')
    .parse(process.argv);

// Parse and merge config
if (opts.config) {
    config = path.resolve(opts.config);
    config = fs.readFileSync(config, 'utf8');
    config = eval('(' + config + ')');
    copier(opts, config);
}

// Glob and merge input
if (opts.input && opts.input.forEach) {
    opts.input.forEach(function (g) {
        var files = glob.sync(g);

        if (files && files.length) {
            opts.args = opts.args.concat(files);
        } else {
            opts.args.push(g);
        }
    });
}

// Default to current directory
if (!opts.args.length) {
    opts.args = ['.'];
}

// Execute doxit
doxit(opts.args, opts);
