#!/usr/bin/env python
# -*- coding: utf-8 -*- #
from __future__ import unicode_literals

AUTHOR = u'Noel Burton-Krahn'
SITENAME = u'Noel Burton-Krahn'
SITEURL = 'http://burton-krahn.com'

PATH = 'content'

TIMEZONE = 'America/Vancouver'

DEFAULT_LANG = u'en'

# Feed generation is usually not desired when developing
FEED_ALL_ATOM = None
CATEGORY_FEED_ATOM = None
TRANSLATION_FEED_ATOM = None
AUTHOR_FEED_ATOM = None
AUTHOR_FEED_RSS = None

# Blogroll
LINKS = (('Pelican', 'http://getpelican.com/'),
         )

# Social widget
SOCIAL = (
    ('Resume', 'static/NoelBurtonKrahnResume.pdf'),
    ('GitHub', 'https://github.com/noelbk'),
    ('Email', 'mailto:noel@burton-krahn.com'),
    ('Facebook', 'https://www.facebook.com/noel.burtonkrahn'),
    )

ROOT_FILES = ['CNAME', 'favicon.ico', 'logo.png']
STATIC_PATHS = ['static'] + ["root/%s" % f for f in ROOT_FILES]
EXTRA_PATH_METADATA = {'root/%s' % f: {'path': f} for f in ROOT_FILES}

DEFAULT_PAGINATION = 5

# Uncomment following line if you want document-relative URLs when developing
RELATIVE_URLS = True

PLUGIN_PATHS = ['pelican-plugins']
PLUGINS = ['render_math']

#THEME = 'pelican-themes/pelican-twitchy'
THEME = 'theme'

BOOTSTRAP_THEME = 'superhero'
###BOOTSTRAP_THEME = 'darkly'
###BOOTSTRAP_THEME = 'readable'
###BOOTSTRAP_THEME = 'united'
###BOOTSTRAP_THEME = 'cyborg'
##BOOTSTRAP_THEME = 'paper'
##BOOTSTRAP_THEME = 'simplex'
##BOOTSTRAP_THEME = 'slate'
#BOOTSTRAP_THEME = 'amelia'
#BOOTSTRAP_THEME = 'cerulean'
#BOOTSTRAP_THEME = 'cosmo'
#BOOTSTRAP_THEME = 'cupid'
#BOOTSTRAP_THEME = 'flatly'
#BOOTSTRAP_THEME = 'journal'
#BOOTSTRAP_THEME = 'lumen'
#BOOTSTRAP_THEME = 'readable-old'
#BOOTSTRAP_THEME = 'sandstone'
#BOOTSTRAP_THEME = 'shamrock'
#BOOTSTRAP_THEME = 'spacelab'

#SITELOGO = 'logo.png'
#SITELOGO_SIZE = '200'
DISPLAY_RECENT_POSTS_ON_MENU = True
SITESUBTITLE = 'When your core shielding breaks down'

DISQUS_SITENAME='noel-burton-krahn'

#CC_LICENSE='CC-BY'
#CC_ATTR_MARKUP=True
