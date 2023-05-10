const Chaincode = require("./chaincode.js");
const { hfc } = require("./imports.js")
const connection = require("./connection.js")
var blockListener = require('./blocklistener.js');

var channelName = hfc.getConfigSetting('channelName');
var chaincodeName = hfc.getConfigSetting('chaincodeName');
var peers = hfc.getConfigSetting('peers');

const chaincode = new Chaincode();

class User {
  constructor(wss) {

    this.username = "";
    this.orgName = "";
    this.wss = wss;
    this.enroll = this.enroll.bind(this);
    this.getuser = this.getuser.bind(this);
    this.create = this.create.bind(this);
    this.getOrgAndUsername = this.getOrgAndUsername.bind(this);

  }

  async enroll(req,res, next) {
      this.username = req.body.username;
      this.orgName = req.body.orgName;

      let response = await connection.getRegisteredUser(
        this.username,
        this.orgName,
        true
      );

      if (response && typeof response !== "string") {
        // Now that we have a username & org, we can start the block listener
        await blockListener.startBlockListener(
          channelName,
          this.username,
          this.orgName,
          this.wss
        );
        res.json(response);
      } else {
        res.json({ success: false, message: response });
      }
  }

  async getuser(req, res, next) {
    let args = req.params;
    let fcn = "queryUser";
    console.log(chaincodeName)
    console.log("chaincodename should have been printed before ok sir ok bye")
    let message = await chaincode.query(peers, channelName, chaincodeName, args, fcn, this.username, this.orgName);
    res.send(message);
  }

  async create(req, res, next) {
      var args = req.body;
      var fcn = "createUser";

      let message = await chaincode.invoke(
        peers,
        channelName,
        chaincodeName,
        args,
        fcn,
        this.username,
        this.orgName
      );
      res.send(message);
  }

  getOrgAndUsername(){
    console.log("Helloooo",this.orgName, this.username)
    return {orgName:this.orgName, username: this.username};
  }
}

module.exports = {User, channelName, chaincodeName, peers};