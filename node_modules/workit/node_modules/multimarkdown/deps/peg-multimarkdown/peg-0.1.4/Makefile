PEG = peg$(X)
LEG = leg$(X)

CFLAGS = -g -Wall $(OFLAGS) $(XFLAGS)
OFLAGS = -O3 -DNDEBUG
#OFLAGS = -pg

OBJS = tree.o compile.o

all : $(PEG) $(LEG)

$(PEG) : peg.o $(OBJS)
	$(CC) $(CFLAGS) -o $@-new peg.o $(OBJS)
	mv $@-new $@

$(LEG) : leg.o $(OBJS)
	$(CC) $(CFLAGS) -o $@-new leg.o $(OBJS)
	mv $@-new $@

ROOT	=
PREFIX	= /usr/local
BINDIR	= $(ROOT)$(PREFIX)/bin

install : $(BINDIR)/$(PEG) $(BINDIR)/$(LEG)

$(BINDIR)/% : %
	cp -p $< $@
	strip $@

uninstall : .FORCE
	rm -f $(BINDIR)/$(PEG)
	rm -f $(BINDIR)/$(LEG)

peg.o : peg.c peg.peg-c

%.peg-c : %.peg
#	./$(PEG) -o $@ $<

leg.o : leg.c

leg.c : leg.leg
#	./$(LEG) -o $@ $<

check : $(PEG) .FORCE
	./$(PEG) < peg.peg > peg.out
	diff peg.peg-c peg.out
	rm peg.out

test examples : .FORCE
	$(SHELL) -ec '(cd examples;  $(MAKE))'

clean : .FORCE
	rm -f *~ *.o *.peg.[cd] *.leg.[cd]
	$(SHELL) -ec '(cd examples;  $(MAKE) $@)'

spotless : clean .FORCE
	rm -f $(PEG)
	rm -f $(LEG)
	$(SHELL) -ec '(cd examples;  $(MAKE) $@)'

.FORCE :
