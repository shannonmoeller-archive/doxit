'use strict'

# Modules
connect = require 'connect'
fs = require 'fs'
path = require 'path'
step = require 'step'

# Export middleware generator
module.exports = (dir, match, ext, compile) ->
  # Return middleware
  ({url}, res, next) ->
    # Allow for index.html
    url += 'index.html' if url.slice(-1) is '/'

    # Serve source files as plain text
    res.setHeader 'Content-Type', 'text/plain' if url.slice(-ext.length) is ext

    # Check for valid extension
    return next() unless match.test url

    # Normalize path
    filename = path.join dir, url.replace(match, ext)

    # Compile or die trying
    step(
      # Check file exists
      -> fs.exists filename, this

      # Get real path
      (exists) ->
        return next() unless exists
        fs.realpath filename, this

      # Read real file
      (err, real) ->
        return next err if err
        filename = real
        fs.readFile filename, 'utf8', this

      # Compile data
      (err, data) ->
        return next err if err
        compile filename, data, this

      # Send response to browser
      (err, data) ->
        return next err if err
        res.setHeader 'Content-Type', connect.static.mime.lookup(url)
        res.end data
    )
