var express = require('express');
var bodyParser = require('body-parser');
var uuid = require('node-uuid');
var datalayer = require('./datalayer');

module.exports = function(db) {
  var googleJWT = JSON.parse(process.env.GOOGLE_JWT);
  datalayer.initDataLayer(googleJWT);

  var app = express();
  app.use(bodyParser.json());

  app.post('/react-storybook-dont-track', function(req, res) {
    res.sendStatus(200);

    var payload = req.body;
    payload.trackedAt = new Date();
    payload.source = 'react-storybook';

    datalayer.getDataLayer().insertAll(
      'dont_tracks',
      [
        {
          insertId: uuid.v4(),
          json: payload
        }
      ]
    );
  });

  app.post('/react-storybook-usage', function(req, res) {
    res.sendStatus(200);

    var payload = req.body;
    payload.trackedAt = new Date();
    payload.source = 'react-storybook';

    datalayer.getDataLayer().insertAll(
      'pings',
      [
        {
          insertId: uuid.v4(),
          json: payload
        }
      ]
    );
  });

  return app;
};
