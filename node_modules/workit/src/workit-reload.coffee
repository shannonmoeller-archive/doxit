'use strict'

# Modules
chokidar = require 'chokidar'
path = require 'path'
socketio = require 'socket.io'
util = require 'util'

# Prozac
debounce = (fn) ->
  timeout = null

  return ->
    clearTimeout timeout
    timeout = setTimeout fn, 50

# Client-side script
client = ->
  # Honor address and port values
  server = '//%s:%s/'

  # Reload handler
  reload = ->
    io.connect(server).on 'workit-reload', ->
      document.location.reload true

  # Are we done yet?
  return reload() if io?

  # Lazy load socket.io
  script = document.createElement('script')
  script.src = server + 'socket.io/socket.io.js'
  script.onload = reload
  target = document.getElementsByTagName('script')[0]
  target.parentNode.insertBefore script, target.nextSibling

# Export generator
module.exports = ({address, dir, port, server}) ->
  connections = 0
  timeout = null
  watcher = null

  # Prep client-side script
  script = util.format "(#{client}());", address, port

  # Open socket
  io = socketio.listen server, 'log level': 0

  # Reload handler
  reload = debounce ->
    io.sockets.emit 'workit-reload'

  # Watch files
  watch = ->
    watcher = chokidar
      .watch(dir, ignored: /\/\.|node_modules/, persistent: true)
      .on('change', reload)
      .on('unlink', reload)

  # Unwatch files
  unwatch = ->
    watcher?.close()
    watcher = null

  # Manage connections
  io.sockets.on 'connection', (s) ->
    # Start watching
    connections += 1
    timeout = clearTimeout timeout

    # Create watcher if needed
    watch() unless watcher

    s.on 'disconnect', ->
      # Stop watching
      connections -= 1
      timeout = setTimeout unwatch, 100 unless connections

  # Return middleware
  ({url}, res, next) ->
    # Guard reload requests
    return next() unless url.slice(-16) is 'workit-reload.js'

    # RAM for the win
    res.setHeader 'Content-Type', 'text/javascript'
    res.end script
