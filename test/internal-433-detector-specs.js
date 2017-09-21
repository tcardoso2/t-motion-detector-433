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

let chai = require('chai');
let chaiAsPromised = require("chai-as-promised");
let should = chai.should();
let fs = require('fs');
let t = require('t-motion-detector');
let ent = require('../Entities');
let main = require('../main.js');
let events = require('events');

//Chai will use promises for async events
chai.use(chaiAsPromised);

before(function(done) {
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
      let d = new ent.R433Detector("My 433 Detector");
    } catch(e){
      e.message.should.equal("'pinIn' is a required argument, which should contain the input receiver  GPIO pin");
      return;
    }
    chai.assert.fail();
  });

  it('"433Notifier" must extend BaseDetector', function() {
    //Assumes there is some local file with the key
    let d = new ent.R433Detector("My 433 Detector", 1);
    (d instanceof t.Entities.MotionDetector).should.equal(true);
  });

  it('should detect the 433 config pin property', function() {
    //Assumes there is some local file with the key
    let pinIn = new main.Config().pinReceiver();
    let d = new ent.R433Detector("My BB8 Detector", pinIn);
    d.pinReceiver.should.equal(pinIn);
  });

  it('should check if a local file exists', function () {
    let local_config = new main.Config();
    local_config.file.default.r433.should.not.equal(undefined);
  });

  it('should detect the 433 config properties from the local config file (default profile)', function() {
    //Assumes there is some local file with the key
    let pinIn = new main.Config().pinReceiver();
    let local_config = new main.Config();
    local_config.file.default.r433.pinReceiver.should.not.equal(undefined);
  });
});

describe("When I try to connect to a 433 Detector ", function() {

  it('should trigger a "onconnect" event', function(done) {
    t.Reset(); 
    let d = new ent.R433Detector("My 433 Detector", 2);
    d.on("onconnect", function(error){
      chai.assert.isOk(true);
      done();
    });
    d.reconnect();
  });
  
  it('the "onconnect" event should return error = false if there are no errors when connecting.', function(done) {
    t.Reset(); 
    let d = new ent.R433Detector("My 433 Detector", 2);
    d.on("onconnect", function(error){
      error.should.equal(false);
      done();
    })
    d.reconnect();
    chai.assert.fail();
  });

  it('should detect it if it is triggered from local config and the t-motion reference from the extension', function(done){
    main.md.Reset();
    let alternativeConfig = new main.md.Config("/test/config_test1.js");

    main.md.StartWithConfig(alternativeConfig);

    let d = main.md.GetMotionDetectors();

    d.length.should.equal(1);
    d[0].name.should.equal("R433 MD");
    d[0].pinReceiver.should.equal(17);
    (d[0] instanceof ent.R433Detector).should.equal(true);

    done();
  });
});
describe("When I Create an environment with a 433 Detector, and trigger a change ", function() {
  it('the 433 should detect that change', function(done) {
    this.timeout(30000);
    t.Reset(); 
    let r433_config = new main.Config().file.default.r433;
    let d = new ent.R433Detector("My 433 Detector", r433_config.pinReceiver);

    let e = new t.Entities.Environment();
    let n = new t.Entities.BaseNotifier();

    let result = false;
    t.Start({
      environment: e,
      initialNotifier: n,
      initialMotionDetector: d
    });

    n.on('pushedNotification', function(message, text){
      if (result) return;  
      console.log("A new notification has arrived!", message, text);
      result = true; 
      done();
    })
    //Enable this for hosts where the 433 Receiver is not installed
    e.addChange(10);
  });
});
