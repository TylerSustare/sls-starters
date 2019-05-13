const mongoose = require('mongoose');
const uuid = require('uuid/v4');
const { connect, Fork } = require('./models');
const res = require('./lib/response');
let conn = null;
let M;
const uri = 'mongodb+srv://mongoatlasusername:mongoatlaspassword@mongoatlasclustername-kefjh.mongodb.net/fork?retryWrites=true'; // db name goes here

module.exports.handler = async(event, context) => {
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
    console.log('CONNECTING'); // block the event loop for research 
  }
  else {
    console.log('NOT connecting'); // block the event loop for research 
  }

  await M.create({ name: `fork-${uuid()}`, prongs: Math.floor(Math.random() * 10) });
  const doc = await M.find();
  return res.OK(doc);
};
