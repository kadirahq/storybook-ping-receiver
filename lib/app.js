var express = require('express');
var graphqlHTTP = require('express-graphql');
var bodyParser = require('body-parser');
var cors = require('cors');
var datalayer = require('./datalayer');
var loadSchema = require('./schema').loadSchema;

module.exports = function(db) {
  var googleJWT = JSON.parse(process.env.GOOGLE_JWT);
  datalayer.initDataLayer(googleJWT);

  var app = express();
  app.use(bodyParser.json());
  app.use(cors({
    origin: ['http://localhost:6006', "https://stats.getstorybook.io", "http://stats.getstorybook.io"],

    credentials: true
  }));

  app.use('/graphql', graphqlHTTP(
    {
      schema: loadSchema(),
      graphiql: true
    }
  ));


  app.post('/react-storybook-dont-track', function(req, res) {
    res.sendStatus(200);

    var payload = req.body;
    payload.trackedAt = new Date();
    payload.source = 'react-storybook';

    datalayer.getDataLayer().insert('dont_tracks', payload);
  });

  app.post('/react-storybook-usage', function(req, res) {
    res.sendStatus(200);

    var payload = req.body;
    payload.trackedAt = new Date();
    payload.source = 'react-storybook';

    datalayer.getDataLayer().insert('pings', payload);
  });

  return app;
};
