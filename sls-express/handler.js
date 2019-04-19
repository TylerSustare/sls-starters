const AWS = require('aws-sdk');
const doc = new AWS.DynamoDB.DocumentClient();
const express = require('serverless-express/express')
const handler = require('serverless-express/handler')
const bodyParser = require('body-parser');
const uuid = require('uuid/v4');

var app = express();
app.use(bodyParser.json({ strict: false }));


app.get('/users', async(req, res, next) => {
  const users = await doc.scan({
    TableName: 'userz'
  }).promise();
  return res.status(200).send(users)
});

app.post('/user', async(req, res, next) => {
  const { username, pass } = req.body;
  const user = {
    id: uuid(),
    username,
    pass
  };
  try {
    await doc.put({
      Item: user,
      TableName: 'userz'
    }).promise();

    return res.status(201).send(user);
  }
  catch (e) {
    return res.status(500).send(e);
  }
});


exports.api = handler(app)
