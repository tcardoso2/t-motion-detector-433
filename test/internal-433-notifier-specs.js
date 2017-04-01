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
//var ent = require('../Entities');
//var main = require('../main.js');
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

describe("When a new 433 Notifier is created, ", function() {
  it('should throw an Exception if no receiver Raspberry pi pin is provided', function() {
    //Assumes there is some local file with the key
    try{
      var n = new ent.433Notifier("My 433 Notifier");
    } catch(e){
      e.message.should.equal("'pinIn' is a required argument, which should contain the input receiver  GPIO pin");
      return;
    }
    chai.assert.fail();
  });

  it('"433Notifier" must extend BaseNotifier', function() {
    //Assumes there is some local file with the key
    var n = new ent.433Notifier("My 433 Notifier", 1);
    (n instanceof t.Entities.BaseNotifier).should.equal(true);
  });

  it('should detect the 433 config pin property', function() {
    //Assumes there is some local file with the key
    var pinIn = new main.Config().pinReceiver();
    var n = new ent.433Notifier("My BB8 Notifier", pinIn);
    n.pinReceiver.should.equal(pinIn);
  });

  it('should check if a local file exists', function () {
    var local_config = new main.Config();
    local_config.file.default.433.should.not.equal(undefined);
  });

  it('should detect the 433 config properties from the local config file (default profile)', function() {
    //Assumes there is some local file with the key
    var pinIn = new main.Config().pinReceiver();
    var local_config = new main.Config();
    local_config.file.default.433.pinReceiver.should.not.equal(undefined);
  });
});

describe("When I try to connect to a 433 Notifier ", function() {
  it('should trigger a "onconnect" event', function(done) {
    var n = new ent.BB8Notifier("My 433 Notifier", 2);
    n.on("onconnect", function(error){
      chai.assert.isOk(true);
      done();
    });
    n.reconnect();
  });
  
  it('the "onconnect" event should return a TypeError if the Receiver Pin is not found around.', function(done) {
    var n = new ent.433Notifier("My 433 Notifier", 2);
    n.on("onconnect", function(error){
      error.should.not.equal(false);
      (error instanceof TypeError).should.equal(true);
      error.message.should.equal("Cannot read property 'peripheral' of undefined");
      done();
    })
    n.reconnect();
    chai.assert.fail();
  });
});
describe("When I Create an environment with a 433 Notifier, and trigger a change ", function() {
  it('the 433 should detect that change', function(done) {
    this.timeout(10000);
    var 433_config = new main.Config().file.default.433;
    var n = new ent.433Notifier("My 433 Notifier", 433_config.pinReceiver);
    var environent; //TODO Continue here!
    chai.assert.fail("Continue here!");
  });
});