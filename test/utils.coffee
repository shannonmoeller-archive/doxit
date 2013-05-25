'use strict'

###*
 * Matches `html` entities.
 *
 * @type {RegExp}
 * @private
###
entities = /&(?!\w+;)/g

###*
 * Escape the given `html`.
 *
 * Examples:
 *
 *     utils.escape '<script></script>' // '&lt;script&gt;&lt;/script&gt;'
 *
 * @param {String} html string to be escaped
 * @return {String} escaped html
 * @api public
###
exports.escape = (html) ->
  String(html)
    .replace(entities, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
