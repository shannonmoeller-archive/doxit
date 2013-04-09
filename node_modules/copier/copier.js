/*jshint node:true */
/**
 * @fileOverview
 * copy Declaration File
 *
 * @author Shannon Moeller
 * @version 1.0
 */

'use strict';

/**
 * Copies the enumerable properties of one or more objects to a target object.
 *
 * @param {Object} target Target object.
 * @param {...Object} objs Objects with properties to copy.
 * @return {Object} Target object, augmented.
 */
module.exports = function copy(target) {
    var arg, i, key, len;
    var args = arguments;

    for (i = 1, len = args.length; i < len; i += 1) {
        arg = args[i];

        for (key in arg) {
            if (arg.hasOwnProperty(key)) {
                target[key] = arg[key];
            }
        }
    }

    return target;
};
