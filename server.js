var MongoClient = require('mongodb').MongoClient;
var appLoader = require('./lib/app');

var port = process.env.PORT || 22022;
var mongoUrl = process.env.MONGO_URL || 'mongodb://localhost/storybook-pings';

MongoClient.connect(mongoUrl, function(err, db) {
  if (err) {
    throw err;
  }

  var app = appLoader(db);
  console.info('"Storybook Ping Receiver" started on port: %d', 22022);
  app.listen(port);
});
