require('strong-agent').profile();

/**
 * If configured as a cluster master, just start controller.
 */

var control = require('strong-cluster-control');
var options = control.loadOptions();

if(options.clustered && options.isMaster) {
  return control.start(options);
}
//everything is wide open.
var allowCrossDomain = function(req, res, next) {
    res.header('Access-Control-Allow-Origin', '*');
    res.header('Access-Control-Allow-Methods','GET, PUT, POST, DELETE, OPTIONS');
    res.header('Access-Control-Allow-Headers', '*');
    //deal with OPTIONS method
    if (req.method == 'OPTIONS') {
      res.send(200);
    } else {
      next();
    }
};

/**
 * Main application
 */

var express = require('express');
var routes = require('./routes');
var http = require('http');
var path = require('path');

//adding authorization
//var auth = require('./routes/auth'); 

var app = express();



app.configure(function(){
  app.set('port', process.env.PORT || 3000);
  app.set('views', __dirname + '/views');
  app.set('view engine', 'ejs');
  app.use(express.favicon());
  app.use(express.logger('dev'));
  app.use(express.bodyParser());
  app.use(express.methodOverride());
  app.use(allowCrossDomain);
  app.use(app.router);
  app.use(express.static(path.join(__dirname, 'public')));
});

app.configure('development', function(){
  app.use(express.errorHandler());
});

var options = {};

/*
var mongo = require('./db/mongo-store');
mongo(options);
options.mongoose = mongo.mongoose;

require('./models/product')(options);
*/
routes(app, options);

//auth.setup(app);

// Start the server
/*app.listen(port, ip, function() {
  console.log('StrongLoop Suite sample is now ready at ' + baseURL);
});*/
http.createServer(app).listen(app.get('port'), function(){
  console.log('vproduct listening on port ' + app.get('port'));
});

