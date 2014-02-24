doxit
=====

The stupid JavaScript documentation generator.

Built with [dox][dox], [jade][jad], [Foundation][fdn], and [Prism][psm].

Installation
------------

Via [npm][npm]:

    $ npm install -g doxit

Usage
-----

    Usage: doxit [options] (glob ...)

    Options:

      -h, --help                  output usage information
      -V, --version               output the version number
      -c, --config [file]         a javascript or json file containing options to use
      -d, --ignore-dirs [regex]   regular expression matching directories to ignore [\.git|\.svn|node_modules]
      -f, --ignore-files [regex]  regular expression matching files to ignore [^_|^\.|~$]
      -i, --input [glob]          comma-separated list of glob patterns matching files and directories to document
      -I, --index [file]          which file to treat as the default
      -o, --output [dir]          output directory [./docs]
      -t, --title [string]        title of the documentation [Documentation]
      -T, --template [file]       jade template to use

Test
----

    $ npm install -d
    $ npm test

Starts a server which hosts the generated test documentation at http://localhost:3000.

Change Log
----------

### 1.2.1
- Updated packages, corrected issues, fixed dependency version numbers.

### 1.1.2
- Fixed issue with path-matching regular expression in Windows.

### 1.1.1
- Better abstraction for long-term maintainability. Moved file globbing from cli to core to make JavaScript api more useful.

### 1.1.0
- Reworked internals. Modified options and api.

### 1.0.0
- Initial implementation.

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

[dox]: https://github.com/visionmedia/dox
[jad]: https://github.com/visionmedia/jade
[fdn]: https://github.com/zurb/foundation
[psm]: https://github.com/LeaVerou/prism
[npm]: http://npmjs.org/
