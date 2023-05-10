var {channelName, chaincodeName, peers} = require("./user.js")
const Chaincode = require("./chaincode.js");
const Datastore = require("./datastore.js");
const { fs,crypto } = require("./imports.js")

var path = require('path');

const datastore = new Datastore();
const chaincode = new Chaincode();

class Metadata {
  constructor(user){
    this.deets = user.getOrgAndUsername

    this.access = this.access.bind(this);
    this.getmetadata = this.getmetadata.bind(this);
    this.update = this.update.bind(this);
    this.upload = this.upload.bind(this);
    this.gethistory = this.gethistory.bind(this);
    this.makecopy = this.makecopy.bind(this);
    this.listallmetadata = this.listallmetadata.bind(this);
    this.verify = this.verify.bind(this);
  }

  async access(req, res, next) {
      // for now we use the username from the param. We can use authentication handler here to retrieve username later.
      // In future need to check if the user is present or not.
      let {username,orgName} = this.deets()
      let args = req.params;
      let fcn1 = "accessMetadata";
      let fcn2 = "getMetadata";
      if (!args.username) {
        throw "No username provided!";
      }

      let message = await chaincode.query(
        peers,
        channelName,
        chaincodeName,
        args,
        fcn2,
        username,
        orgName
      );
      if (message.length == 0) {
        throw "No metadata matching the id";
      }
      message = message[0];
      const dir = './temp';
      if (!fs.existsSync(dir)) {
        fs.mkdirSync(dir, {
          recursive: true
        });
      }
      const filePath = path.join("temp", message.awsKey);
      let data = await datastore.download(message.awsKey, message.bucket);
      console.log(data)
      fs.writeFileSync(filePath, data.Body);
      res.download(filePath, async function (err) {
        if (err) {
          // Handle error, but keep in mind the response may be partially-sent
          // so check res.headersSent
          console.log(res.headersSent);
        } else {
          // decrement a download credit, etc. // here remove temp file
          fs.unlink(filePath, function (err) {
            if (err) {
              console.error(err);
            }
            console.log("Temp File Deleted");
          });

          await chaincode.invoke(
            peers,
            channelName,
            chaincodeName,
            args,
            fcn1,
            username,
            orgName
          );
        }
      });
  }

  async getmetadata(req, res, next) {
      let {username,orgName} = this.deets()
      // for now we use the username from the param. We can use authentication handler here to retrieve username later.
      // logger.info("================ GET on metadata by Id");
      let args = req.params;
      let fcn = "getMetadata";

      let message = await chaincode.query(
        peers,
        channelName,
        chaincodeName,
        args,
        fcn,
        username,
        orgName
      );
      res.send(message);
  }

  async update(req, res, next) {
      let {username,orgName} = this.deets()
      // logger.info("================ PATCH on metadata by Id");
      let args = { ...req.params, ...req.body };
      let fcn = "modifyMetadata";

      let metadata = await chaincode.query(
        peers,
        channelName,
        chaincodeName,
        { metadataId: args.metadataId },
        "getMetadata",
        username,
        orgName
      );
      metadata = metadata[0];
      let newData = req.body;
      if (newData.citations) {
        newData.citations = JSON.parse(newData.citations);
      }
      var newMetadata = {
        ...metadata,
        ...newData,
      };
      let message = await chaincode.invoke(
        peers,
        channelName,
        chaincodeName,
        newMetadata,
        fcn,
        username,
        orgName
      );
      res.send(message);
  }

  async upload(req, res, next) {
    let {username,orgName} = this.deets()
      // logger.info("================ POST on metadata");
      var args = req.body;
      var fcn = "createMetadata";
      // Add more validations later/ seperate validation code to different function
      if (!req.file) {
        throw "No file provided.";
      }
      if (!args.citations) {
        args.citations = "[]";
      }

      var metadataId = crypto.randomUUID();
      var extension = req.file.originalname.split(".").pop();
      var unique_id = `${args.username}-${metadataId}-${Date.now().toString(
        36
      )}.${extension}`;
      var attributes = await datastore.upload(unique_id, req.file.buffer);

      let allMetadata = await chaincode.query(
        peers,
        channelName,
        chaincodeName,
        args,
        "getAllMetadata",
        username,
        orgName
      );
      var metadata = {
        metadataId: metadataId,
        name: args.name,
        description: args.description || "",
        published_by: orgName,
        authentic_source: orgName,
        username: args.username,
        citations: JSON.parse(args.citations),
        awsKey: attributes.key,
        dataHash: attributes.hash,
        bucket: attributes.bucket,
      };
      try {
        for (let m of allMetadata) {
          if (m.dataHash && m.dataHash === metadata.dataHash) {
            throw "Data hash already present in the blockchain";
          }
        }
        let message = await chaincode.invoke(
          peers,
          channelName,
          chaincodeName,
          metadata,
          fcn,
          username,
          orgName
        );
        res.send(message);
      } catch (e) {
        await datastore.delete(unique_id);
        next(e);
      }
  }

  async gethistory(req, res, next) {
      let {username,orgName} = this.deets()
      let args = req.params;
      let fcn = "getHistory";

      let message = await chaincode.query(
        peers,
        channelName,
        chaincodeName,
        args,
        fcn,
        username,
        orgName
      );
      res.send(message);
  }

  async makecopy(req, res, next) {
    let {username,orgName} = this.deets()
    /**Req contains :
     * username : Username ,
     * metdataId : metadataId,
     */
    let args = req.body;
    let metadata = await chaincode.query(peers, channelName, chaincodeName, { "metadataId": args.metadataId }, "getMetadata", username, orgName);
    if (metadata.toString() == '') {
    	throw ("Metadata not found");
    }
    metadata = metadata[0];
    if (metadata.published_by == orgName) {
    	throw ("You cannot make copy of your own data.");
    }
    if (metadata.accessed_by) {
    	delete metadata.accessed_by;
    }
    let metadataId = crypto.randomUUID();
    let data = await datastore.download(metadata.awsKey, metadata.bucket);
    let attribs = await datastore.upload(metadata.awsKey, data.Body);
    let cpMetadata = {
    	...metadata,
    	published_by: orgName,
    	copied_from: metadata.published_by,
    	copy_of: metadata.metadataId,
    	metadataId: metadataId,
    	username: args.username,
    	awsKey: attribs.key,
    	bucket: attribs.bucket
    }
    await chaincode.invoke(peers, channelName, chaincodeName, { ...metadata, operation: "copied", copied_by: orgName }, "modifyMetadata", username, orgName);
    let message = await chaincode.invoke(peers, channelName, chaincodeName, cpMetadata, "createMetadata", username, orgName);
    res.send({ status: true, message: message, awsKey: attribs.key, bucket: attribs.bucket });

    return makecopyfunc;
  }

  async listallmetadata(req, res, next) {
      let {username,orgName} = this.deets()
      let args = req.params;
      let fcn = "getAllMetadata";

      let message = await chaincode.query(
        peers,
        channelName,
        chaincodeName,
        args,
        fcn,
        username,
        orgName
      );
      let message_name_map = {};
      let citation_count = {};
      for (let m of message) {
        message_name_map[m.metadataId] = m.name;
        if (m.citations) {
          for (let c of m.citations) {
            if (citation_count[c]) {
              citation_count[c] += 1;
            } else {
              citation_count[c] = 1;
            }
          }
        }
      }
      let copy_count = {};
      for (let m of message) {
        copy_count[m.metadataId] = 1;
      }
      for (let m of message) {
        if (m.copied_from) {
          if (copy_count[m.copied_from]) {
            copy_count[m.copied_from] += 1;
          }
        }
      }
      let access_count = {};
      let all_history = {};
      for (let m of message) {
        let history = await chaincode.query(
          peers,
          channelName,
          chaincodeName,
          { metadataId: m.metadataId },
          "getHistory",
          username,
          orgName
        );
        all_history[m.metadataId] = history;
        let count = 0;
        for (let h of history) {
          let data = JSON.parse(h.data);
          if (data.operation == "access") {
            count += 1;
          }
        }
        access_count[m.metadataId] = count;
      }

      message = message.map((data) => {
        if (copy_count[data.metadataId]) {
          data.copy_count = copy_count[data.metadataId];
        } else {
          data.copy_count = 1;
        }
        if (citation_count[data.metadataId]) {
          data.citation_count = citation_count[data.metadataId];
        } else {
          data.citation_count = 0;
        }

        if (access_count[data.metadataId]) {
          data.access_count = access_count[data.metadataId];
        } else {
          data.access_count = 0;
        }

        if (all_history[data.metadataId]) {
          data.history = all_history[data.metadataId];
        } else {
          data.history = [];
        }
        if (data.citations) {
          data.citations = data.citations.map((c) => ({
            metdataId: c,
            name: message_name_map[c],
          }));
        }
        return data;
      });

      res.send(message);
  }

  async verify(req, res, next) {
      let {username,orgName} = this.deets()
      var args = req.body;
      var sel_args = { metadataId: args.metadataId };
      var fcn = "getMetadata";
      let metadata = await chaincode.query(
        peers,
        channelName,
        chaincodeName,
        sel_args,
        fcn,
        username,
        orgName
      );
      // index errors should be handled by middleware further down the road.
      let hash = crypto.createHash("md5").update(req.file.buffer).digest("hex");
      console.log(
        `File hash is ${hash}. Metadata hash is ${metadata[0].dataHash}`
      );
      let check = metadata[0].dataHash == hash;
      let result = {
        status: check,
      };
      res.send(result);
  }
}

module.exports = Metadata;
