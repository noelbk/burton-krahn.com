INSTALLATION
------------

This blog is built with [Pelican](https://blog.getpelican.com/).

INSTALLATION
------------

Set up a Python virtualenv and install dependencies

	virtualenv env
	. env/bin/activate
	pip install --upgrade pip
	pip install -r requirements.txt

Get Pelican plugins and themes

	git clone --recursive https://github.com/getpelican/pelican-plugins
	git clone --recursive https://github.com/getpelican/pelican-themes

BUILDING
--------

To view pages while you edit them:

	make devserver
	make stopserver

To publish:

	make github
	
