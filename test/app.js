var MongoClient = require('mongodb').MongoClient;
var appLoader = require('../lib/app');
var request = require('request');
var expect = require('chai').expect;
var UUID = require('uuid');
var db;
var app;

describe('App', function() {
  before(function(done) {
    var mongoUrl =
      process.env.TEST_MONGO_URL || 'mongodb://localhost/storybook-pings-test';

    MongoClient.connect(mongoUrl, function(err, _db) {
      if (err) throw err;
      db = _db;
      app = appLoader(db);
      app.listen(6009, done);
    });
  });

  beforeEach(function(done) {
    var promises = [
      db.collection('pings').remove({}),
      db.collection('dont-tracks').remove({})
    ];

    Promise.all(promises).then(function() {
      done();
    });
  });

  describe('/react-storybook-dont-track', function() {
    it('should save dontTracks to db', function(done) {

      var userId = UUID.v4();
      var payload = {
        userId: userId
      };

      request.post('http://localhost:6009/react-storybook-dont-track', {
        json: payload
      }, function(err) {
        if (err) throw err;
        db.collection('dont-tracks').findOne(function(err, item) {
          expect(item.userId).to.be.equal(userId);
          expect(item.source).to.be.equal('react-storybook');
          expect(Date.now() - item.trackedAt.getTime()).to.be.within(0, 100);
          done();
        });
      });
    });
  });

  describe('/react-storybook-usage', function() {
    it('should save pings to db', function(done) {
      var userId = UUID.v4();
      var version = '2.9.0';
      var payload = {
        userId: userId,
        version: version
      };

      request.post('http://localhost:6009/react-storybook-usage', {
        json: payload
      }, function(err) {
        if (err) throw err;
        db.collection('pings').findOne(function(err, item) {
          expect(item.userId).to.be.equal(userId);
          expect(item.version).to.be.equal(version);
          expect(item.source).to.be.equal('react-storybook');
          expect(Date.now() - item.trackedAt.getTime()).to.be.within(0, 100);
          done();
        });
      });
    });
  });
});
