/*jshint indent: 4, node: true, white: true */
/**
 * The stupid documentation generator.
 *
 * @author Shannon Moeller <me@shannonmoeller.com>
 * @version 1.1.0
 */

'use strict';

// Modules
var dox = require('dox');
var fs = require('fs');
var jade = require('jade');
var markdown = require('marked');
var mkdirp = require('mkdirp');
var path = require('path');

/**
 * Matches directory names. Useful for generating relative paths.
 *
 * @type {RegExp}
 */
var matchDir = new RegExp('[^' + path.sep + ']+', 'g');

/**
 * Generates a filter method based on ignore options.
 *
 * @param {Array.<String>} files
 * @returns {Function(String):Boolean}
 */
var ignore = function (options) {
    var ignoreDirs = options.ignoreDirs;
    var ignoreFiles = options.ignoreFiles;

    return function (item) {
        return !ignoreDirs.test(path.dirname(item)) &&
               !ignoreFiles.test(path.basename(item));
    };
};

/**
 * Parses a file and compiles dox.
 *
 * @param {Array.<String>} files
 * @returns {Object}
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
 * Parses a jade template and returns a render method.
 *
 * @param {Array.<String>} files
 * @returns {Function(Object):String}
 */
var parseTemplate = function (template) {
    var data = fs.readFileSync(template, 'utf8');

    return jade.compile(data, {
        filename: template,
        pretty: true
    });
};

/**
 * Public api.
 *
 * @param {Array.<String>} files
 * @param {Object} options
 */
module.exports = function (files, options) {
    var index = options.index;
    var outputDir = options.output;
    var title = options.title;
    var template = parseTemplate(options.template);
    var list = files.sort()
                    .filter(ignore(options))
                    .map(parseFile);

    // Generate file
    var generate = function (file, base, meta) {
        // Create path
        var filename = path.join(outputDir, file);

        // Create directory
        mkdirp.sync(path.dirname(filename));

        // Create file
        fs.writeFileSync(filename, template({
            base: base,
            meta: meta,
            files: list,
            title: title
        }));
    };

    // Determine files to generate
    var determine = function (meta) {
        var originalPath = meta.originalPath;
        var dirname = path.dirname(originalPath);

        // Convert dirname to relative path
        if (dirname && dirname !== '.') {
            dirname = dirname.replace(matchDir, '..') + '/';
        } else {
            dirname = '';
        }

        // Generate index file
        if (originalPath === index) {
            generate('index.html', '', meta);
        }

        // Generate corresponding file
        generate(originalPath + '.html', dirname, meta);
    };

    // Determine output files
    list.forEach(determine);
};
