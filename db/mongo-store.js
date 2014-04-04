/**
 * A module to connect to a MongoDB store
 */
module.exports = function(options) {
  options = options || {};
  var mongoose = options.mongoose || require('mongoose')
  , config = require('./config');

  module.exports.mongoose = mongoose;
  mongoose.connection.on('error', console.error.bind(console, 'connection error:'));
  mongoose.connection.once('open', function() {
    console.log('MongoDB connection opened');
  });

  var generate_mongo_url = function(obj) {
    obj.hostname = (obj.hostname || 'localhost');
    obj.port = (obj.port || 27017);
    obj.db = (obj.db || 'restapi_development');
    if (obj.username && obj.password) {
      return "mongodb://" + obj.username + ":" + obj.password + "@" + obj.hostname + ":" + obj.port + "/" + obj.db;
    } else {
      return "mongodb://" + obj.hostname + ":" + obj.port + "/" + obj.db;
    }
  }

// default to a 'localhost' configuration:
var connection_string = '127.0.0.1:27017/restapi_development';
// if OPENSHIFT env variables are present, use the available connection info:
if(process.env.OPENSHIFT_MONGODB_DB_PASSWORD){
  connection_string = process.env.OPENSHIFT_MONGODB_DB_USERNAME + ":" +
  process.env.OPENSHIFT_MONGODB_DB_PASSWORD + "@" +
  process.env.OPENSHIFT_MONGODB_DB_HOST + ':' +
  process.env.OPENSHIFT_MONGODB_DB_PORT + '/' +
  process.env.OPENSHIFT_APP_NAME;
}

  // bootstrap mongoose connection
  //var mongo = config.mongodb.development;
  //var mongourl = generate_mongo_url(mongo);

  if (mongoose.connection.readyState == 0) {
    module.exports.db = mongoose.connect(connection_string);
  }
}
