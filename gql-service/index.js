const mongoose = require('mongoose')
const uuid = require('uuid/v4')
let conn = null;
const uri = 'mongodb+srv://sustare_atlas_user:4hfMik9L9IDr1neQ@sustare-stfjh.mongodb.net/fork?retryWrites=true' // db name goes here

module.exports.handler = async function(event, context) {
  // Make sure to add this so you can re-use `conn` between function calls.
  // See https://www.mongodb.com/blog/post/serverless-development-with-nodejs-aws-lambda-mongodb-atlas
  context.callbackWaitsForEmptyEventLoop = false;

  // Because `conn` is in the global scope, Lambda may retain it between
  // function calls thanks to `callbackWaitsForEmptyEventLoop`.
  // This means your Lambda function doesn't have to go through the
  // potentially expensive process of connecting to MongoDB every time.
  if (conn == null) {
    conn = await mongoose.createConnection(uri, {
      // Buffering means mongoose will queue up operations if it gets
      // disconnected from MongoDB and send them when it reconnects.
      // With serverless, better to fail fast if not connected.
      useNewUrlParser: true,
      bufferCommands: false, // Disable mongoose buffering
      bufferMaxEntries: 0 // and MongoDB driver buffering
    });
    conn.model('Fork', new mongoose.Schema({ name: String }));
  }

  const M = conn.model('Fork');
  const a = await M.create({ name: `forker-${uuid()}` })
  const doc = await M.find();
  const response = {
    "statusCode": 200,
    "headers": {
      "my_header": "my_value"
    },
    "body": JSON.stringify(doc),
    "isBase64Encoded": false
  };
  return response;
};
