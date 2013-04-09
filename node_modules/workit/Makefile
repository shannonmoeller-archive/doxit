# Phony

all: test

distclean:
	$(RM) -r node_modules

test: node_modules
	./node_modules/.bin/forever bin/workit test

.PHONY: all distclean test

# Actual

node_modules:
	npm install
