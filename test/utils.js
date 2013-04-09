/*jshint node: true */
'use strict';

/**
 * Matches `html` entities.
 *
 * @type {RegExp}
 * @private
 */
var entities = /&(?!\w+;)/g;

/**
 * Escape the given `html`.
 *
 * Examples:
 *
 *     utils.escape('<script></script>') // '&lt;script&gt;&lt;/script&gt;'
 *
 * @param {String} html string to be escaped
 * @return {String} escaped html
 * @api public
 */
exports.escape = function(html){
    return String(html)
        .replace(entities, '&amp;')
        .replace(/</g, '&lt;')
        .replace(/>/g, '&gt;');
};
