# djoyapp
P3 course of IMD winter term 2015 / 2016.  
Igor Filipe, Isabella Roscher, Max Sommer, Olga Zimmermann  
Djoya is going to be an app that helps you find out what to do here and right now.

##How to run the server:  
OSX: Open the terminal and navigate to the folder you saved the project in and run the following command:   
``` DEBUG=version-01:* npm start ```  

##How to add an event:
* Step 1: Open database.db which is to be found in the root directory with sqlitebrowser.
* Step 2: Open Google Maps / any map service that lets you find out your geolocation and copy the information.
* Step 3: Add a new row to table events and paste the information.

##To Do:
###Version ~0.4:
* Introduction / Tutorial
* Navigation

###Version ~0.3:
* Recommendations
* Account Settings

###Version ~0.2:
* Login System
* Register Site
* Login Site

####Version 0.15:
* Details
* Media
* Share

####Version 0.14:  
* Remove old entries when they are not relevant any more.
* Add a new event
* AJAX handler vor asyncronous site loading 
* AJAX load 'new event' page

##Done:
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

