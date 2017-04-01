//A specialized BB8 Notifier class which reacts by doing stuff the BB8 does so well, light, roll, etc..
var t = require('t-motion-detector');
var BaseNotifier = t.Entities.BaseNotifier;

//A BB8 Notifier which reacts (notifies) in many different ways
class R433Notifier extends BaseNotifier{

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
      var Rpi433    = require('rpi-433');
      this.rfSniffer = Rpi433.sniffer({
        pin: this.pinReceiver,      //Snif on GPIO (e.g. 2 (or Physical PIN 13))
        debounceDelay: 500          //Wait 500ms before reading another code
      });

      // Receive (data is like {code: xxx, pulseLength: xxx})
      this.rfSniffer.on('data', function (data) {
        console.log('incoming signal!');
        console.log('Code received: '+data.code+' pulse length : '+data.pulseLength);
      });

      console.log("Pin receiver is ", this.pinReceiver);
    } catch(e){
      this.emit('onconnect', e);
      return;
    }
    this.emit('onconnect', false);    
  }
}

exports.R433Notifier = R433Notifier;