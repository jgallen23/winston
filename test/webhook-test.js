/*
 * webhook-test.js: Tests for instances of the Webhook transport
 *
 * (C) 2011 Marak Squires
 * MIT LICENSE
 *
 */

require.paths.unshift(require('path').join(__dirname, '..', 'lib'));

var path = require('path'),
    vows = require('vows'),
    fs = require('fs'),
    http = require('http'),
    assert = require('assert'),
    winston = require('winston'),
    helpers = require('./helpers');

var webhookTransport = new (winston.transports.Webhook)({ 
  "host": "localhost",
  "port": 8080,
  "path": "/winston-test"
});

var server = http.createServer(function (req, res) {
  res.end();
});

server.listen(8080);

vows.describe('winston/transports/webhook').addBatch({
  "An instance of the Webhook Transport": {
    "when passed valid options": {
      "should have the proper methods defined": function () {
        helpers.assertWebhook(webhookTransport);
      },
      "the log() method": helpers.testNpmLevels(webhookTransport, "should respond with true", function (ign, err, logged) {
        assert.isNull(err);
        assert.isTrue(logged);
      })
    }
  }
}).addBatch({
  "When the tests are over": {
    "the server should cleanup": function () {
      server.close();
    }
  }
}).export(module);