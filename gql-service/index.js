const mongoose = require('mongoose')
const uuid = require('uuid/v4')
const { connect, Fork } = require('./models');
let conn = null;
let M;
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
    conn = await connect(uri);
    M = Fork(conn);
    console.log('connection to mongodb established') // block the event loop for research purposes 
  }

  const a = await M.create({ name: `fork-${uuid()}` })
  const doc = await M.find();
  const response = {
    "statusCode": 200,
    "headers": {
      "my_header": "my_value"
    },
    "body": JSON.stringify(doc, null, 2),
    "isBase64Encoded": false
  };
  return response;
};
