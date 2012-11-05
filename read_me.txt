"mapthing" for lack of a better name.


This code was generously supported by metro planning , and continues to be developed with the help and support of them and the City of Springfield Or.
As far as the legal stuff , it is up to you to be cool with it , if you burn down your server , its
your own fault. Take responsibility for yourself and do the right thing, don't blame others for trying to help you.
Better yet , help others and lets make a great web mapping library that you don't have to mortgage your house to purchase.



The code is very very beta!!!


Here is a bit on the background story, more to come soon:
I have a strong past in 3d animation , and I am obsessed with nodes and trees. I am not an expert programmer by any means , but I always get the job done.
I started out three years ago knowing absolutely nothing about web programming. I am entirely self taught , adding to the confusion of things.
I began learning Openlayers and went through the example code provided. I pretty much learned Javascript from going through openlayers source ,
 and borrowed heavily from what I could take from it. I took the structure of my Class object and my loader script almost directly from Openlayers.
About 3 months into it , I realized that PHP would be necessary if I were to talk to postgis. I rushed through the PHP part and banged out a working server ,
but it is cobbled together and in need of work. I will release the server end of it as soon as I can clean it up a bit.
The server is named Geode , and almost entirely built over labor day weekend , 2011. Geode is a PHP front end for postgis.
The core of mapthing is AJAX based , it was designed to request data from postGIS via Geode and draw it with openlayers. 
All the AJAX routines are built around HTTPrequest. I use no other libraries , attempting to make it as standalone as possible.

The current dependency stack is

Openlayers
Proj4js
ExtJs
Geoext

I also used the following keyboard shortcut script for debugging , but not for the actual release

http://www.openjs.com/scripts/events/keyboard_shortcuts/

I made a great effort to split the code into modules that can be used independently or all together. All the modules are sketches of ideas based on purpose , like vector geometry ,
 class definition , AJAX requests , etc. Each module is a work in progress and not really what I would call done. there are many things that have no purpose in there , but they serve as placeholders for ideas.
there are some goofy named items , for example MDAG was a joke to my Maya roots. DAG is the core maya structure , so I called my main map object MDAG to represent a container for all the tools and objects.
Some things are redundant and possibly wrong , like for example I built and object to store the openlayers map object. I cant say my plan was right or wrong , it was how I felt it should be done ,
and I encourage things to be questioned and rearranged.  I have a lot to do yet to make this presentable , but I wanted to get this out as a first draft. 
I will try to get a version of the PHP server code out soon as well.



-Keith Legg

November 5, 2012



Questions can be emailed to : Keith Legg , perihelionvfx@gmail.com , or keith@metroplanning.com












 

