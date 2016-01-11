# djoyapp
P3 course of IMD winter term 2015 / 2016.  
Igor Filipe, Isabella Roscher, Max Sommer, Olga Zimmermann  
Djoya is going to be an app that helps you find out what to do here and right now.

##Installation:
Before trying to run the server please execute the following command in the directory of the server:  
``` npm install lwip --save ```

##How to run the server:  
OSX: Open the terminal and navigate to the folder you saved the project in and run the following command:   
``` DEBUG=version-01:* npm start ```  

##To Do:
###Version ~0.4:
* Introduction / Tutorial
* Navigation

###Version ~0.3:
* Recommendations
* Account Settings

###Version ~0.2:
* Create new event: write user-id in db
* Registration rules (minimal password length etc.)

##Done:
####Version 0.21:
* Added Fonts (Lato & Mission Script[for now the free version since we're not commercial])
* Login restrictions
* Welcome Page
* Fill subpages with content
* Link all pages to each other to create a flow

###Version 0.2:
* Login (and respective subpages)
* Authentication via passport-local
* Registration (and respectives subpages)
* Logout (and respective subpages)

####Version 0.153:
* Fixes
* UI Tweaks
* ~~Share~~

####Version 0.152:
* Fixed UI Bugs
* Additional texts for Details page
* Media for Events

####Version 0.151:
* CSS fixes
* Details page for events is now available
* Initial loading time for events should be better now
* Animations for transitions
* Version 0.151b: Several bugfixes

####Version 0.150:
* Client auto-updates event radar every 10 seconds
* Client auto-updates location every minute
* Removed obsolete update button

####Version 0.142:
* Client side included jQuery for UI manipulations & easy AJAX
* Add a new Event (template for form and server-side)

####Version 0.141:
* Remove old entries when they are not relevant any more.

####Version 0.13:
* Upon refresh only events that are new are added to the clients local list of events which means there are no more duplications  

####Version 0.12:  
* Events are now filtered by distance (~1km) and time (6hours)
* Client now displays events as red dots, relative to your position
* Refresh button added
* Refresh sound triggers when clicking the button  

####Version 0.11:
* Server now sends an array of JSON objects to client which contains events near you.

###Version 0.1:  
* SQlite3
* Database.db
* Search for all events in radius of 1km
* HTML / CSS / JS Base from interface tests

##Known Bugs:  

##Thanks to all contributors and folks out there helping these projects we use:

Font-Awesome
https://fortawesome.github.io/Font-Awesome/icons/  
normalize.css
https://necolas.github.io/normalize.css/  
Adam Kaplans Grid (we know they recommend not using this for production, but we're prototyping!)
http://adamkaplan.me/grid/  
WebAudioX
https://github.com/jeromeetienne/webaudiox  
MomentJS
http://momentjs.com/  
Octave
https://github.com/scopegate/octave/   
SQLite3
https://github.com/mapbox/node-sqlite3/wiki/API  
Multer
https://github.com/expressjs/multer  
lwip
https://github.com/EyalAr/lwip  
passport.js
http://passportjs.org/  
passport-local
https://github.com/jaredhanson/passport-local  
Kimson Doan (Djoya welcome screen background image)
https://unsplash.com/yaykimmyd  
