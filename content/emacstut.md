Title: Emacs Advanced Features Tutorial
Date: 2015-08-27
Category: Programming
Summary: The good bits of Emacs, after the online tutorial without too much kool-aid

Emacs Advanced Features Tutorial
--------------------------------

Introduction
------------

Depending on who you ask, Emacs is either an advanced text editor, a
lisp-based operating system, or a program cleverly designed to tie
your fingers into knots.  It's a bit of all of the above.  I encourage
programmers to give it a try, but there seems to be a mythos around
Emacs that it's too complicated to learn.  This is an advanced
tutorial about Emacs.  I'll skip over most of the basics and get into
more of the really advanced features that make it actually useful.

Conventions
-----------

Emacs is a lisp operating system with an editor bolted on top.  All
the functions of Emacs are written in Lisp, and there are a lot of
them.  There are functions for colorizing and indenting programming
languages, reading email, games, etc.  More on that later.

Emacs functions are bound to keys.  There are lots of key
combinations, so be prepared for some finger flexibility conditioning.
Here's how key bindings are represented in Emacs documentation:

    "C-"      - Means hold contol, then type a key
    "M-"      - Means type escape, then type a key.
    	      	Emacs calls this the "meta" key.
    "C-f"     - means hold control, press f, release
    "C-u C-f" - means hold control, press u, release, hold control,
    	      	press f, release
    "C-u f"   - means hold control, press u, release, type h
    "M-f"     - means press Escape, release, type f

Emacs has an extensive online help system which I highly recommend to
you... in a bit.  Reviewing the tutorial now, I can see where the
mythos about weird key combos came from.  Emacs goes back to Richard
Stallman's Editor MaCroS in 1976, before keyboards had standard cursor
movement keys, so the tutorial starts with a long section on cursor
movement using weird key bindings like "C-f", "C-b", "C-v", etc.
Ignore all that.  The standard cursor movement keys work.  Feel free
to take a detour to the tutorial now with:

    "C-h t" - Emacs tutorial

... Welcome back!  I'll start with some basic commands first if you
skipped the tutorial, but you can get back to it any time with "C-h
t".

Before We Begin
---------------

1. Download this whole repo from github

    git clone [https://github.com/noelbk/emacstut](https://github.com/noelbk/emacstut)
    
    cd emacstut

2. Install this .emacs startup file.  I added a couple of simple
   keybindings.

    cp -i dot-emacs ~/.emacs

3. Reopen this tutorial in Emacs

    emacs README.md

Basic Commands
--------------

Safety first:  In case you need to quit emacs (not yet, though!):

    "C-x C-c" - quit emacs

and in case you get stuck in a command, or Emacs becomes unresponsive
because a command's taking too long, you can always break out of the
current command with:

    "C-g" - quit current function

Now on to editing files:

    "C-x C-f" - open a file in a new buffer

    "C-x k" - kill buffer (close file)

Wait! don't open a new file until you know how to get back here.  Let
me tell you about buffers first.  Emacs opens files in buffers, and
displays buffers in windows.  Let's do a quick experiment in Emacs
(you *are* reading this file in Emacs, right?) to make sure you know
how to open a new buffer, display it, and get back.

1. Type "C-x 4 f hellotut.c" to open hellotut.c in a new window.

2. Notice how the screen is split now with hellotut.c below this
   tutorial.Also, notice how the cursor is in the hellotut.c window,
   and the cursor in this window is hollow.

3. Type "C-x o" to move the cursor back to this window.

4. Type "C-x 1" to make this window take up the whole frame.

5. Type "C-x b RET" to switch to viewing hellotut.c again.

6. Congratulations for finding your way back here with another
   "C-x b RET"!

Eventually you may find you never leave Emacs, just keep opening new
buffers within it and switching between them.  Goodbye, mouse!

Help
----

Did I mention Emacs has a great help system?

    "C-h ?" - list all help commands
    "C-h t" - Emacs tutorial
    "C-h b" - list all key bindings
    "C-h k" - help for a particular key binding
    "C-h f" - help for a function
    "C-h a" - help apropos - keyword search

This is one of my favorites to explore all the functions available in Emacs:

    "C-h f TAB" - list all functions in emacs

Oh, and you can open man pages in emacs too:

    "M-x man" 

Emacs has its own manual system called info, which is extensive:

    "C-h i" - list all functions in emacs

Shells
------

You can run interactive shells inside emacs buffers.  That means you
can cut-and-paste from example code into shells, from shells to your
log, etc.

    "M-x shell" - start a new shell in a buffer named *shell*
    "M-x newshell" - start a new shell in a buffer with a new name

    "M-!"     - put shell command output in new buffer
    "C-u M-!" - insert shell command output at cursor
    "M-|"     - pipe region through command, output in new buffer
    "C-u M-|" - pipe region through command, output at cursor

Emacs shells are a little different from regular terminals: Your
cursor is free to move off the command line, so you can move, select,
and search in them like any other buffer.

    "C-x h", "C-w" - cut all text (clear the buffer)
    "M->" - end of buffer (last command line)
    "M-p" - previous command (command history)
    "M-r" - regexp search backwards through command history
    
Emacs shells also track the current directory, so when you do "C-x f"
to open a file, it's relative to the shell's current directory.

Emacs shells are dumb.  They don't do terminal emulation.  If you
really need terminal capabilities for curses, use

    "M-x term" - start a shell in terminal mode

Emacs can open and edit files on remote hosts, and open shells there
too:

    "M-x ssh" - start a shell ssh'ed to user@host

    "C-x C-f /ssh:USER@HOST:PATH" open a file via ssh to HOST

    "C-x C-f /sudo::PATH" open a file with sudo, so you can edit root-writable files with tramp


Compilation
-----------

Compilation buffers work like grep, Emacs runs a command into a buffer then parses the results to iterate over errors:

    "M-x compile" - run make in a buffer
    "M-x `" - next-error - jump to next error

Try it now:

    1. "M-x compile" - oops! you should see an error in hellotut.c
    2. "M-x `" - will open the file hellotut.c at the error
    3. comment out "Intentional error here!"
    4. "M-x compile" - compiled OK
    
Amusements
----------

Did I mention emacs is a lisp OS?  Yes, there are games:

    "M-x life"
    "M-x pong"
    "M-x snake"
    "M-x hanoi"
    "M-x doctor"
    
Buffers, Windows and Frames
---------------------------

    "C-x f" - open file in a new buffer
    "C-x 4 f" - open file in buffer, split window
    "C-x k" - kill buffer (close file)

    "C-x b" - switch to buffer
    "C-x o" - move cursor to other window
    "C-x 1" - make current buffer fill window

    "C-x C-b" - list all buffers

    "C-x 4 b" - switch to buffer, split window vertically
    "C-x 3 b" - switch to buffer, split window horizontally
    "C-x 5 b" - switch to buffer in new frame


Selecting text
--------------

Cutting, copying, and pasting

    "C-SPC" - Set the mark.  That's used for selecting a range of text
     	      between the mark and the cursor

    "C-x h" - select the whole buffer.
    
    "C-w" - cut text between cursor and mark.  Sorry, Emacs was
    	    invented before Macintosh, so it bound the now common C-x
    	    and C-v to other functions.
    
    "M-w" - copy text between point and mark

    "C-y" - paste text

    "C-x r k" - cut a rectangle of text between cursor and mark
    "C-x r y" - paste a rectangle of text

Searching
---------

The i in isearch is for incremental.  Emacs will search and highlight
matches as you type.  Type "C-r" to search backwards.

    "C-s" - isearch
    "C-s C-r" - isearch backwards
    "M-C-s" - regexp isearch

Query-replace prompts for each replacement:

    "C-r" - query replace regexp

Even better, you can run grep into a buffer, then step through the
results, jumping to matches:

    "M-x grep" - run grep over files in the current directory
    "M-x grep-find" - run grep recursively into subdirs

Modes
-----

Each buffer has a mode for the type of file it contains.  The mode
controls syntax highlighting, indentation rules, and mode-specific
functions.

For example, if you open hellotut.c again, you'll be in c++-mode.  Try
these commands:

      "M-\" - indent region
      ")", "}", "]" - blink matching parens
      "C-h m" - help on current mode

What Next?
----------

Finger exercises :).  Then, read the tutorial and explore the info
system with "C-h i".  Also see [A Guided Tour of
Emacs](http://www.gnu.org/software/emacs/tour/)

Questions, comments, and pull requests are welcome!  I'd like to hear
how Emacs worked out for you.


  Noel Burton-Krahn <noel@burton-krahn.com>
  Aug 27, 2015

