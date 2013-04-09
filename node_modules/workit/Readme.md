workit
======

The stupid development server.

- Reloads browser on source-file change.
- Serves [CoffeeScript][coff], [Jade][jade], and [Stylus][styl] like a champ.
- Compiled output sent directly to browser for a pristine working directory.
- No preprocessor caching so you're guaranteed to load the freshest code.
- CORS enabled.

Built with [Node.js][node] using [Connect][conn], [Socket.io][sock],
[Commander.js][comm], and [Chokidar][chok]. Inspired by visionmedia's [serve][serv]
and nodejitsu's [http-server][hser].

Installation
------------

Via [npm](http://npmjs.org/):

    $ npm install -g workit

Usage
-----

```

    Usage: workit [options] [dir]

    Options:

      -h, --help              output usage information
      -V, --version           output the version number
      -a, --address <string>  set hostname [127.0.0.1]
      -f, --format <string>   connect logger format [dev]
      -p, --port <number>     set port number [3000]

    Examples:

      Serve the current directory

        $ cd /var/www
        $ workit
        Serving /var/www at http://localhost:3000/

      Serve a specific directory

        $ workit /var/www/foo
        Serving /var/www/foo at http://localhost:3000/

      Serve a specific directory with options

        $ workit -a 192.168.0.1 -p 8080 /var/www/foo
        Serving /var/www/foo at http://192.168.0.1:8080/

```

Features
--------

### Preprocessing

`workit` transparently compiles `.coffee`, `.jade`, and `.styl` files and sends
the output directly to the browser. No rendered files are written to disk, so
your working directory is left in a pristine state (I'm looking at you
[connect-assets][coas]).

File extensions are taken literally. If you request `.jade`, you'll get Jade:

```

    $ curl 'http://localhost:3000/foo.jade'
    !!! 5
    title Hello world
    link(rel='stylesheet', href='foo.css')
    script(src='workit-reload.js')
    script(src='foo.js')

```

If you want the slightly-more-useful compiled HTML, request `.htm` or `.html`
instead:

```

    $ curl 'http://localhost:3000/foo.html'
    <!DOCTYPE html>
    <title>Hello world</title>
    <link rel="stylesheet" href="foo.css">
    <script src="workit-reload.js"></script>
    <script src="foo.js"></script>

```

Same goes for `.coffee` vs `.js` and `.styl` vs `.css`.

### Auto-reload

To enable automatic reloading of a page when a file in your project is created
or changed, simply include the virtual `workit-reload.js` in your markup:

```

    <!-- HTML -->
    <script src="workit-reload.js"></script>

    // Jade
    script(src='workit-reload.js')

```

The filename is magic, so the path doesn't matter:

```

    // Also works!
    script(src='../my/public/assets/dir/workit-reload.js')

```

### CORS (cross-origin resource sharing)

All requests are forcibly served with the `Access-Control-Allow-Origin: *`
header to [enable CORS][cors].

Third-party resources that aren't CORS friendly can be requested via the
built-in, and quite naive, proxy:

```

    $ curl 'http://localhost:3000/workit-cors/http://www.google.com/search?q=nodejs'
    <!doctype html><html itemscope="itemscope" itemtype="http://schema.org/WebPage" ...

```

### Nib

[Nib][nib] is made available to Stylus files. Just import it:

```

    @import 'nib'

    *
        // Nib will add vendor prefixed variants
        box-sizing: border-box

```

### Data URI Inlining

Inlining of assets via Stylus' `url()` is not enabled (this is a dev server
after all), but you may install [node-canvas][ncan] to get IE-friendly inlined
gradients.

Change Log
----------

### 1.0.2
- Corrected host value in piped request headers.
- Fixed another string length bug in workit-cors.

### 1.0.1
- Fixed string length bug in workit-cors.

### 1.0.0
- Changed middleware prefixes from `connect-` to `workit-` so as not to be
  confused with middleware of the same name by different authors.

### 0.3.0
- Now using `chokidar` instead of `watchr`. Vastly improves performance and
  cross-platform reliability of file watching, especially when the server should
  be idle. Fixes #6.

### 0.2.4
- Upgraded from `flow` to `step`.

### 0.2.3
- Replaced all `fs.*Sync` with their async counterparts.
- Nuked some superfluous variable assignments.

### 0.2.2
- Added CORS header and proxy.

### 0.2.1

- Now using `watchr` instead of `hound`. Common system and hidden files are now
  ignored. Fixes #5.
- Now using `forever` instead of `supervisor` in `make test`.

License
-------

(The MIT License)

Copyright (c) Shannon Moeller &lt;me@shannonmoeller.com&gt;

Permission is hereby granted, free of charge, to any person obtaining
a copy of this software and associated documentation files (the
'Software'), to deal in the Software without restriction, including
without limitation the rights to use, copy, modify, merge, publish,
distribute, sublicense, and/or sell copies of the Software, and to
permit persons to whom the Software is furnished to do so, subject to
the following conditions:

The above copyright notice and this permission notice shall be
included in all copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED 'AS IS', WITHOUT WARRANTY OF ANY KIND,
EXPRESS OR IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF
MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT.
IN NO EVENT SHALL THE AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY
CLAIM, DAMAGES OR OTHER LIABILITY, WHETHER IN AN ACTION OF CONTRACT,
TORT OR OTHERWISE, ARISING FROM, OUT OF OR IN CONNECTION WITH THE
SOFTWARE OR THE USE OR OTHER DEALINGS IN THE SOFTWARE.

[chok]: https://github.com/paulmillr/chokidar/
[coas]: https://github.com/TrevorBurnham/connect-assets/
[coff]: http://coffeescript.org/
[comm]: http://visionmedia.github.com/commander.js/
[conn]: http://senchalabs.org/connect/
[cors]: http://enable-cors.org/
[hser]: https://github.com/nodeapps/http-server/
[jade]: http://jade-lang.com/
[ncan]: https://github.com/LearnBoost/node-canvas/
[nib]:  http://visionmedia.github.com/nib/
[node]: http://nodejs.org/
[serv]: https://github.com/visionmedia/serve/
[sock]: http://socket.io/
[styl]: http://learnboost.github.com/stylus/
