//A specialized BB8 Notifier class which reacts by doing stuff the BB8 does so well, light, roll, etc..
let t = require('t-motion-detector');
let MotionDetector = t.Entities.MotionDetector;

//A BB8 Detector which detects 433Mhz radio signals
class R433Detector extends MotionDetector{

  constructor(name, pinIn) {
    super(name);
    if(pinIn){
      this.pinReceiver = pinIn;
    } else {
      throw new Error("'pinIn' is a required argument, which should contain the input receiver  GPIO pin");
    }
  }

  reconnect()
  {
    try{
      let Rpi433    = require('rpi-433');
      this.rfSniffer = Rpi433.sniffer({
        pin: this.pinReceiver,      //Snif on GPIO (e.g. 2 (or Physical PIN 13))
        debounceDelay: 500          //Wait 500ms before reading another code
      });
      let _this = this;
      // Receive (data is like {code: xxx, pulseLength: xxx})
      this.rfSniffer.on('data', function (data) {
        console.log('incoming signal!');
        console.log('Code received: '+data.code+' pulse length : '+data.pulseLength);

        _this.send(data);
      });

      console.log("Pin receiver is ", this.pinReceiver);
    } catch(e){
      this.emit('onconnect', e);
      return;
    }
    this.emit('onconnect', false);    
  }

  startMonitoring(){
    super.startMonitoring();
    this.reconnect();
  }
}

exports.R433Detector = R433Detector;
