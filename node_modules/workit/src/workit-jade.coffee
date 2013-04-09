'use strict'

# Modules
helper = require './helper'
jade = require 'jade'

# Compiler
compile = (filename, data, cb) ->
  cb null, jade.compile(data, filename: filename, pretty: true)()

# Export middleware
module.exports = (dir) ->
  helper dir, /\.html?$/, '.jade', compile
