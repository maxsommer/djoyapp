var express = require('express');
var router = express.Router();


/* GET home page. */
/*
/     Hier soll die Homepage gerendert werden,
/     je nach 'Status' kann das aber verschieden sein:
/     bin ich eingeloggt soll hier direkt das 'Spaßradar'
/     sein. Benutze ich die App das erste Mal und bin nicht
/     eingeloggt wird mir hier der Welcomescreen angezeigt.
/     Benutze ich die App das erste Mal registriert wird
/     hier die Einführung gezeigt.
/
/     Zu Testzwecken ist das Ganze hier jetzt erst einmal
/     unser Spaßradar
*/

router.get('/', function(req, res, next) {
      if( req.user ){
            //    Der Nutzer ist eingeloggt, also soll, je nachdem ob er schon
            //    eine Einführung bekommen hat, die Einführung oder das Radar
            //    gezeigt werden :)

            res.redirect('radar');
      }
      else{
            res.redirect('/welcome');
      }
});

module.exports = router;
