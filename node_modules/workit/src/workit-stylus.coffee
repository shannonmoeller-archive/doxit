'use strict'

# Modules
helper = require './helper'
nib = require 'nib'
stylus = require 'stylus'

# Compiler
compile = (filename, data, cb) ->
  stylus(data).set('filename', filename).use(nib()).render(cb)

# Export middleware
module.exports = (dir) ->
  helper dir, /\.css$/, '.styl', compile
