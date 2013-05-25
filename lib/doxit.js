/*jshint indent: 4, node: true */
/**
 * The stupid JavaScript documentation generator.
 *
 * @module doxit
 * @author Shannon Moeller <me@shannonmoeller.com>
 * @version 1.1.2
 */

'use strict';

// Modules
var dox = require('dox');
var fs = require('fs');
var glob = require('glob');
var jade = require('jade');
var markdown = require('marked');
var mkdirp = require('mkdirp');
var path = require('path');
var util = require('util');

/**
 * Matches directory names. Useful for generating platform-agnostic relative paths.
 *
 * @type {RegExp}
 */	
var matchDir = new RegExp('[^\\' + path.sep + ']+', 'g');

/**
 * Parses a file, compiles dox or markdown, and returns metadata.
 *
 * @param {String} file
 * @return {Object}
 */
var parseFile = function (file) {
    var resolved = path.resolve(file);
    var extname = path.extname(resolved);
    var data = fs.readFileSync(resolved, 'utf8');

    // Parse by file type
    switch (extname) {
    case '.js':
        data = dox.parseComments(data);
        break;
    case '.md':
        data = markdown(data);
        break;
    }

    // Return parsed data
    return {
        data: data,
        extension: extname,
        fullPath: resolved,
        originalPath: file
    };
};

/**
 * Glob a string and concat results
 *
 * @param {Array.<String>} ret
 * @param {String} arg
 * @return {Array}
 */
var reduceGlob = function (ret, arg) {
    return ret.concat(glob.sync(arg));
};

/**
 * Generates an ignore filter method.
 *
 * @param {Object} options
 * @return {Function(String):Boolean}
 */
var makeFilter = function (options) {
    var ignoreDirs = options.ignoreDirs;
    var ignoreFiles = options.ignoreFiles;

    return function (item) {
        return !ignoreDirs.test(path.dirname(item)) &&
               !ignoreFiles.test(path.basename(item));
    };
};

/**
 * Generates a jade template render method.
 *
 * @param {Array.<String>} files
 * @return {Function(Object):String}
 */
var makeRenderer = function (options) {
    var template = options.template;
    var data = fs.readFileSync(template, 'utf8');

    return jade.compile(data, {
        filename: template,
        pretty: true
    });
};

/**
 * Generates a file write method.
 *
 * @param {Object} options
 * @return {Function(String,String,Object,Array.<Object>)}
 */
var makeWriter = function (options) {
    var title = options.title;
    var outputDir = options.output;
    var render = makeRenderer(options);

    return function (file, base, meta, list) {
        // Create path
        var filename = path.join(outputDir, file);

        // Create directory
        mkdirp.sync(path.dirname(filename));

        // Create file
        fs.writeFileSync(filename, render({
            base: base,
            files: list,
            meta: meta,
            title: title
        }));
    };
};

/**
 * Generates a file handler method which determines what files to write.
 *
 * @param {Object} options
 * @return {Function(String,Number,Array.<String>)}
 */
var makeHandler = function (options) {
    var index = options.index;
    var writeFile = makeWriter(options);

    return function (meta, i, list) {
        var originalPath = meta.originalPath;
        var dirname = path.dirname(originalPath);

        // Generate index file
        if (originalPath === index) {
            writeFile('index.html', '', meta, list);
        }

        // Convert dirname to relative base path
        if (dirname && dirname !== '.') {
            dirname = dirname.replace(matchDir, '..') + '/';
        } else {
            dirname = '';
        }

        // Generate corresponding file
        writeFile(originalPath + '.html', dirname, meta, list);
    };
};

/**
 * Takes a list of file paths or globs and generates documentation files.
 *
 * @param {Array.<String>} files List of file paths or globs
 * @param {Object=} options An object containing program options
 * @return {undefined}
 */
var doxit = function (files, options) {
    if (!util.isArray(files)) {
        throw new TypeError('Property `files` must be an Array.');
    }

    if (options && typeof options !== 'object') {
        throw new TypeError('Property `options` must be an Object.');
    }

    var filterFile = makeFilter(options);
    var handleFile = makeHandler(options);

    files.reduce(reduceGlob, []) // glob files
         .filter(filterFile)     // remove ignored
         .sort()                 // sort by path
         .map(parseFile)         // parse contents
         .forEach(handleFile);   // output doc files
};

/** Export doxit */
module.exports = doxit;
