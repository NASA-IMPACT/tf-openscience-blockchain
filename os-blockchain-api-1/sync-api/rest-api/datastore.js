var AWS = require('aws-sdk');

var BUCKETNAME = process.env.BUCKETNAME;

class Datastore {
    constructor() {
        this.s3Bucket = new AWS.S3();
    }

    async upload(key, dataBuffer) {
        let params = {
            Body: dataBuffer,
            Key: key,
            Bucket: BUCKETNAME
        };
        const s3Response = await this.s3Bucket.putObject(params).promise();
        let response = {
            statusCode: 200,
            key: key,
            hash: s3Response.ETag.replace(/\"/g, ""),
            bucket: BUCKETNAME
        };
        return response;
    }

    async delete(key) {
        await this.s3Bucket.deleteObject({ Bucket: BUCKETNAME, Key: key }).promise();
    }

    async download(key) {
        console.log(`Fetching ${key} from ${BUCKETNAME}.`);
        let data = await this.s3Bucket.getObject({ Key: key, Bucket: BUCKETNAME }).promise();
        return data;
    }
}

module.exports = Datastore;
