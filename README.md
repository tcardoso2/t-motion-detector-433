# t-motion-detector-433
An extension of t-motion-detector for 433Mhz Receiver, based on rpi-433, wiringPi and t-motion-detector packages  
* v 0.1.8: Small update to refer to t-motion-detector v0.4.8, latest version
* v 0.1.7: Fixed dependency making sure t-motion-detector recognizes t-motion-detector-433
* v 0.1.6: Minor updates.
* v 0.1.5: Correcting bug which for latest version of t-motion-detector was not propagating 433Mhz motion detector signals to the Notifiers, namely SlackNotifier, other minor fixes
* v 0.1.4: Exposed Entities from main.js, needed when including the 433 module;
* v 0.1.3: Correcting some bugs refactored Notifier as Detector, that's actually what it is
* v 0.1.2: Implementing initial code / improving tests (WIP)
* v 0.1.1: Created first mocha tests (WIP)
* v 0.1.0: First commit
