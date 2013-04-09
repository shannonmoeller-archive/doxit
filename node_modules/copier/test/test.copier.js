/*jshint node:true */
/*global assert, describe, it */
/**
 * @fileOverview
 * copier Tests File
 *
 * @author Shannon Moeller
 * @version 1.0
 */

'use strict';

var copier = require('copier');

describe('copier()', function() {
    it('should copy properties from multiple objects to a target object', function() {
        var foo = { a: 1, b: 2 };
        var bar = { b: 3, c: 4 };

        assert.deepEqual(copier({}, foo, bar), { a: 1, b: 3, c: 4 });
    });

    it('should modify the target object, not the others', function() {
        var foo = { a: 1, b: 2 };
        var bar = { b: 3, c: 4 };

        copier(foo, bar);

        assert.deepEqual(foo, { a: 1, b: 3, c: 4 });
        assert.deepEqual(bar, { b: 3, c: 4 });
    });
});
