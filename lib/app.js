var express = require('express');
var bodyParser = require('body-parser');

module.exports = function(db) {
  var app = express();
  app.use(bodyParser.json());

  app.post('/react-storybook-dont-track', function(req, res) {
    res.sendStatus(200);

    var collection = db.collection('dont-tracks');
    var payload = req.body;
    payload.trackedAt = new Date();
    payload.source = 'react-storybook';

    collection.insert(payload, function(err) {
      if (err) {
        console.error('Error inserting a dont-track to DB', err);
      }
    });
  });

  app.post('/react-storybook-usage', function(req, res) {
    res.sendStatus(200);

    var collection = db.collection('pings');
    var payload = req.body;
    payload.trackedAt = new Date();
    payload.source = 'react-storybook';

    collection.insert(payload, function(err) {
      if (err) {
        console.error('Error inserting a ping to DB', err);
      }
    });
  });

  return app;
};
