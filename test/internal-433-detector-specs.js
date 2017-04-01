  /*****************************************************
 * Internal tests
 * What are internal tests?
 * As this is a npm package, it should be tested from
 * a package context, so I'll use "interal" preffix
 * for tests which are NOT using the npm tarball pack
 * For all others, the test should obviously include
 * something like:
 * var md = require('t-motion-detector');
 *****************************************************/

var chai = require('chai');
var chaiAsPromised = require("chai-as-promised");
var should = chai.should();
var fs = require('fs');
var t = require('t-motion-detector');
var ent = require('../Entities');
var main = require('../main.js');
var events = require('events');

//Chai will use promises for async events
chai.use(chaiAsPromised);

before(function(done) {
  var n = undefined;
  done();
});

after(function(done) {
  // here you can clear fixtures, etc.
  done();
});

describe("When a new 433 Detector is created, ", function() {
  it('should throw an Exception if no receiver Raspberry pi pin is provided', function() {
    //Assumes there is some local file with the key
    try{
      var d = new ent.R433Detector("My 433 Detector");
    } catch(e){
      e.message.should.equal("'pinIn' is a required argument, which should contain the input receiver  GPIO pin");
      return;
    }
    chai.assert.fail();
  });

  it('"433Notifier" must extend BaseDetector', function() {
    //Assumes there is some local file with the key
    var d = new ent.R433Detector("My 433 Detector", 1);
    (d instanceof t.Entities.MotionDetector).should.equal(true);
  });

  it('should detect the 433 config pin property', function() {
    //Assumes there is some local file with the key
    var pinIn = new main.Config().pinReceiver();
    var d = new ent.R433Detector("My BB8 Detector", pinIn);
    d.pinReceiver.should.equal(pinIn);
  });

  it('should check if a local file exists', function () {
    var local_config = new main.Config();
    local_config.file.default.r433.should.not.equal(undefined);
  });

  it('should detect the 433 config properties from the local config file (default profile)', function() {
    //Assumes there is some local file with the key
    var pinIn = new main.Config().pinReceiver();
    var local_config = new main.Config();
    local_config.file.default.r433.pinReceiver.should.not.equal(undefined);
  });
});

describe("When I try to connect to a 433 Detector ", function() {
  it('should trigger a "onconnect" event', function(done) {
    var d = new ent.R433Detector("My 433 Detector", 2);
    d.on("onconnect", function(error){
      chai.assert.isOk(true);
      done();
    });
    d.reconnect();
  });
  
  it('the "onconnect" event should return error = false if there are no errors when connecting.', function(done) {
    var d = new ent.R433Detector("My 433 Detector", 2);
    d.on("onconnect", function(error){
      error.should.equal(false);
      done();
    })
    d.reconnect();
    chai.assert.fail();
  });
});
describe("When I Create an environment with a 433 Detector, and trigger a change ", function() {
  it('the 433 should detect that change', function(done) {
    this.timeout(30000);
    var r433_config = new main.Config().file.default.r433;
    var d = new ent.R433Detector("My 433 Detector", r433_config.pinReceiver);

    var e = new t.Entities.Environment();
    var n = new t.Entities.BaseNotifier();

    var result = false;
    t.Start({
      environment: e,
      initialNotifier: n,
      initialMotionDetector: d
    });

    n.on('pushedNotification', function(message, text){
        console.log("A new notification has arrived!", message, text);
        done();
    })
    e.addChange(10);
  });
});