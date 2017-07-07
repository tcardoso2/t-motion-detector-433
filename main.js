let t = require('t-motion-detector');
let ent = require("./Entities.js");

class Config extends t.Config {

	constructor()
	{
		super();
		//FIXME: This is not ideal, I had to repeat the local binding because 
		//       it was defaulting to the parent one, will check for an improvement 
		//       later
		try{
          this.file = require('./local.js');
        } catch (e)
        {
          this.file = require('./config.js');
        }
	}

	pinReceiver()
	{
		return "xxx";
	}
}

exports.Config = Config;
exports.Entities = ent;
//To refer to t-motion-detector this reference should be used!

exports.md = t;