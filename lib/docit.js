/*jshint evil: true, node: true, indent: 4, white: true */
/**
 * The stupid documentation generator.
 *
 * @author Shannon Moeller <me@shannonmoeller.com>
 * @version 1.0.0
 */

'use strict';

// Modules
var dox = require('dox');
var fs = require('fs');
var jade = require('jade');
var markdown = require('marked');
var mkdirp = require('mkdirp');
var path = require('path');
var q = require('q');
var walkdir = require('walkdir');

/**
 * Walks a specified directory, finds all matching files, and returns a promise of normalized path data.
 *
 * @param {String} p The path of the directory to walk.
 * @param {Object} options The command line options.
 * @returns {Promise.<Array.<Object>>} A promise for a list of file data.
 */
var grep = function (p, options) {
    var files = [];
    var deferred = q.defer();
    var resolved = path.resolve(p);
    var index = options.index && path.resolve(options.index);
    var walk = walkdir(resolved, { follow_symlinks: true });

    // Filter files and generate normalized data
    walk.on('file', function (filename, stat) {
        var dirname = path.dirname(filename);
        var basename = path.basename(filename);

        // Exclude ignored directories
        if (options.ignoreDirs.source && options.ignoreDirs.test(dirname)) {
            return;
        }

        // Exclude ignored files
        if (options.ignoreFiles.source && options.ignoreFiles.test(basename)) {
            return;
        }

        // Exclude ignored extensions
        if (options.extensions.source && !options.extensions.test(basename)) {
            return;
        }

        // Generate normalized data and add to output
        files.push({
            index: index,
            filename: filename,
            dirname: dirname,
            basename: basename,
            relative: path.join(
                path.basename(resolved),
                path.relative(resolved, filename)
            )
        });
    });

    // Resolve promise with normlized data
    walk.on('end', function () {
        deferred.resolve(files);
    });

    // Return promise of async data
    return deferred.promise;
};

/**
 * Sorts a list of objects by a relative filename.
 *
 * @param {Object} a
 * @param {Object} b
 * @returns {Number} -1, 0, or 1
 */
var sortByFilename = function (a, b) {
    var av = a.relative;
    var bv = b.relative;

    if (av === bv) {
        return 0;
    }

    return av < bv ? -1 : 1;
};

/**
 * Takes a list of file meta data and generates documentation.
 *
 * @param {Array.<Object>} files The path of the directory to walk.
 * @param {Object} options The command line options.
 */
var generate = function (files, options) {
    // Sanitize output location
    var output = path.resolve(options.output);

    // Prep template
    var render = jade.compile(
        fs.readFileSync(options.template, 'utf8'),
        { filename: options.template, pretty: true }
    );

    // Sort by relative filename
    files.sort(sortByFilename);

    // Generate documentation for each file
    files.forEach(function (file) {
        var outputData = null;

        // Determine output location
        var outputFile = path.join(output, file.relative) + '.html';
        var outputDir = path.dirname(outputFile);

        // Read file
        var data = fs.readFileSync(file.filename, 'utf8');

        // Handle by filetype
        if (file.filename.slice(-3) === '.js') {
            data = dox.parseComments(data);
        } else {
            data = markdown(data);
        }

        // Render data
        outputData = render({
            title: options.title,
            meta: file,
            files: files,
            data: data
        });

        // Write file
        mkdirp.sync(outputDir);
        fs.writeFileSync(outputFile, outputData);

        // Create index alias
        if (file.filename === file.index) {
            fs.writeFileSync(path.join(output, 'index.html'), outputData);
        }
    });
};

/**
 * Public api.
 *
 * @param {Array.<String>} files
 * @param {Object} options
 */
module.exports = function (files, options) {
    var promises = [];

    // Find files for each path given
    files.forEach(function (p) {
        promises.push(grep(p, options));
    });

    // Wait for data to return
    q.all(promises).then(function (targets) {
        // Flatten lists of file data and generate documentation
        generate(Array.prototype.concat.apply([], targets), options);
    });
};
