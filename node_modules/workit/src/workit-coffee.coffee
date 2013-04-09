'use strict'

# Modules
helper = require './helper'
Snockets = require 'snockets'

# Compiler
compile = (filename, data, cb) ->
  new Snockets().getConcatenation filename, cb

# Export middleware
module.exports = (dir) ->
  helper dir, /\.js$/, '.coffee', compile
