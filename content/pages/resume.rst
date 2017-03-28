:Title: Resume
:Date: 2017-03-10
:Category: AboutMe

Noel Burton-Krahn Code Samples
==============================

Here are some of samples of my own code from my favourite past
projects.

Please see my full `Resume`_ and `Github account`_.


Genetisnake (Genetic Programming, Three.js, Phoenix)
----------------------------------------------------

.. image:: {filename}/static/battlesnakes.png
   :alt: Battlesnake game board
   :align: left
   :target: https://cdn.rawgit.com/noelbk/genetisnake/abc247e/html/snake.html

`Battlesnakes_` is an AI competition where snakes compete to survive
on a simple board.  My entry did pretty well programmed with `genetic
programming`_.  I rendered the board with `three.js`_, and the game
server was a multi-room chat application written in Phoenix_

GKViewer Video Recording and Playback (C++, OpenGL, ActiveX)
------------------------------------------------------------

.. image:: {filename}/static/gkviewer-screenshot-2-200.jpg
   :alt: GKViewer video review application
   :align: left
   :target: {filename}/static/gkviewer-screenshot-2.jpg

This was a multi-camera digital video recording and playback
system. The code cross-compiled on Linux and Windows to save and
display video on a Linux recoding unit, and to play back on Windows
through an ActiveX component written in C++ using OpenGL. Here is the
main class for the player: `glplayer.h`_, `glplayer.cpp`_.

The player was implemented in OpenGL, including all video windows and
UI controls such as playback buttons, scroll bars, etc. All UI
controls were descended from a common GLActor class. Here is the
GLActor that displays video: `glactorvideo.h`_, `glactorvideo.cpp`_.

The main OpenGL video playback system was wrapped in an ActiveX control
for Windows, and embedded in a VB.Net application. This is the ActiveX
wrapper: `GLPlayerCtlCtrl.h`_, `GLPlayerCtlCtrl.cpp`_

One challenge was to save and display video on a Linux platform that had
very limited CPU resources. I designed a real-time scheduling system
that would guarantee saving video to disk (safe from system crashes) and
decompress video and display at a slower rate: `task.h`_, `task.cpp`_.

Hotswap - Transparent Failover for Linux (C++, linux kernel)
------------------------------------------------------------

.. image:: {filename}/static/lisa02-200.png
   :alt: LISA'02 hotswap presentation
   :align: left
   :target: {filename}/static/lisa02.pdf

My Master's project was to replicate Linux process trees between
servers, so one server could seamlessly take over from another without
losing data or breaking network connections.


Page Flipping (Java, OpenGL)
----------------------------

.. image:: {filename}/static/pageflip-200.png
   :alt: Java page flipping applet
   :align: left

This is a Java applet I worked on as a prototype for a photo album
application. Click the image to see it in action.

`Planed.java`_ computes a transformation matrix for flipping the
OpenGL model matrix across a plane. I also use it for planar
reflections in other applications.

This applet uses `jogl`_ to call OpenGL directly. I have also used the
`Java Monkey Engine`_ for 3D Java applications.


P2PVPN (C/C++, wxWidgets)
-------------------------

.. image:: {filename}/static/p2pvpn-screens-connect-200.png
   :alt: P2PVPN UI
   :align: left
   :target: {filename}/static/p2pvpn-screens-connect.png

P2PVPN is a peer-to-peer firewall-tunneling VPN. It connects peer
computers through firewall like Skype does, but instead of voice
conferencing, P2PVPN creates a virtual ethernet interface and gives
peers virtual IP addresses for each other.

There are three main components: A desktop client daemon
(`p2p\_peer.h`_, `p2p\_peer.c`_) authenticates with a central Linux
server, and a desktop UI (`p2p\_ui\_frame.h`_, `p2p\_ui\_frame.cpp`_)
communicates with the desktop daemon. The client and server are pure
C.  The desktop UI is C++ using `wxWidgets`_. The whole code base
cross-compiles to Windows and Linux.


Web Server / Database Applications
----------------------------------

.. image:: {filename}/static/bofgraph-200.png
   :alt: Simple HTML graph
   :align: left

Most of my bread and butter work is making web servers and distributed
systems with Python (`djselect.py`_, `expand.py`_), C#, Groovy, Java,
Erlang, Phoenix, Django.

Cloud computing and devops: AWS, Docker, Kubernetes, consul, etcd.

Databases: MySQL, PostgreSQL, SQL Server, DB2

Version control: Git, Subversion, Mercurial



.. _Resume: {filename}/static/NoelBurtonKrahnResume.pdf
.. _Github account: https://github.com/noelbk
.. _Planed.java: {filename}/static/pageapplet/Planed.java
.. _jogl: https://jogl.dev.java.net
.. _Java Monkey Engine: http://www.jmonkeyengine.com
.. _wxWidgets: http://wxwidgets.org
.. _p2p\_peer.h: {filename}/static/p2p_peer.h
.. _p2p\_peer.c: {filename}/static/p2p_peer.c
.. _p2p\_ui\_frame.h: {filename}/static/p2p_ui_frame.h
.. _p2p\_ui\_frame.cpp: {filename}/static/p2p_ui_frame.cpp
.. _|image3|: {filename}/static/gkviewer-screenshot-2.jpg
.. _glplayer.h: {filename}/static/glplayer.h
.. _glplayer.cpp: {filename}/static/glplayer.cpp
.. _glactorvideo.h: {filename}/static/glactorvideo.h
.. _glactorvideo.cpp: {filename}/static/glactorvideo.cpp
.. _GLPlayerCtlCtrl.h: {filename}/static/GLPlayerCtlCtrl.h
.. _GLPlayerCtlCtrl.cpp: {filename}/static/GLPlayerCtlCtrl.cpp
.. _task.h: {filename}/static/task.h
.. _task.cpp: {filename}/static/task.cpp
.. _djselect.py: {filename}/static/djselect.py
.. _expand.py: {filename}/static/expand.py
.. _Sensors.pm: {filename}/static/Sensors.pm
.. _battelsnakes: https://www.battlesnake.io/
.. _three.js: https://threejs.org/
.. _Genetic programming: https://en.wikipedia.org/wiki/Genetic_programming
.. _phoenix: http://www.phoenixframework.org/


.. Local Variables:
.. compile-command: "(cd .. && rst2html --stylesheet={filename}/static/markdown.css {filename}/static/README.rst > README.html)"
.. End:
