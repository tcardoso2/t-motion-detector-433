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

describe("When I Create an environment with a 433 Detector, and trigger a change", function() {

  it('should propagate that change to Notifiers, namely Slack Notifier (real test)', function(done) {
    this.timeout(5000);
    t.Reset();
    let r433_config = new main.Config().file.default.r433;
    let d = new ent.R433Detector("My 433 Detector", r433_config.pinReceiver);

    let e = new t.Entities.Environment();
    let key = new main.Config().slackHook(); 
    let n = new t.Extensions.SlackNotifier("My Slack Notifier", key); 
    
    n.on('pushedNotification', function(from, text, data){
      console.log("A new notification has arrived from 433Mhz detector!", from, text);
      if (result || (text == "Started")) {
        console.log("Nothing to do.");
        return;
      }
      from.should.equal("My Slack Notifier"); 
      text.should.equal("Notification received from: My 433 Detector");
      //Expecting the signal pulse to be greated than 300, for no special reason, just to check
      data.notifier.detectors[0].currentIntensity.pulseLength.should.be.gt(300);
      result = true;
      console.log("done"); 
      done();
    });
    let result = false;
    t.Start({
      environment: e,
      initialNotifier: n,
      initialMotionDetector: d
    });
    //Todo: This should be instead simulated via sending a real 433Mhz signal via a transciever;
    d.on('onconnect', function(signal){
      console.log("433 MHz receiver is connected");
      signal.should.equal(false);
      e.addChange(1); 
    }); 
  });
});

