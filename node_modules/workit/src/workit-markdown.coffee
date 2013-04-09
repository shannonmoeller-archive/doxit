'use strict'

# Modules
fs = require 'fs'
helper = require './helper'
markdown = require 'multimarkdown'

# Compiler
compile = (filename, data, cb) ->
  fs.readFile filename, 'utf8', (err, data) ->
    cb(err, markdown.convert(data))

# Export middleware
module.exports = (dir) ->
  helper dir, /\.html$/, '.mdown', compile
