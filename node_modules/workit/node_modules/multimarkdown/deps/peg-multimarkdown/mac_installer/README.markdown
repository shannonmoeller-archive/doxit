
To create an installer for Mac OS X:

* `make` peg-multimarkdown

* `make test`, `make mmdtest`, `make latextest` to be sure everything worked
  properly

* `make installer` to copy the binary into the proper folder

* open the `Make OS X Installer` file and select "Build"

You can now run the installer or distribute it to others. You can also modify
the other resource files to add to the Readme, etc.