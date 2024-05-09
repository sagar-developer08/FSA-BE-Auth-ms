// authController.js
const authService = require('../services/authService');
// const AWS = require('aws-sdk');
const AWS = require('../config/awsConfig')
exports.registerUser = async (req, res) => {
  try {
    const user = await authService.registerUser(req.body);
    res.status(201).json({ data: user });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};


// 

const credentials = new AWS.Credentials({
  accessKeyId: AWS.config.credentials.accessKeyId,
  secretAccessKey: AWS.config.credentials.secretAccessKey,
});

AWS.config.credentials = credentials;

AWS.config.update({ region: 'ap-south-1' });


const sqs = new AWS.SQS();

// 
exports.loginUser = async (req, res) => {
  try {
    const token = await authService.loginUser(req.body);
    console.log(token,'token')
    // Send message to SQS queue
    const params = {
      MessageBody: JSON.stringify({ token }),
      QueueUrl: 'https://sqs.ap-south-1.amazonaws.com/992382671249/fsa',
    };
    console.log(params,'param')
    await sqs.sendMessage(params).promise();

    res.status(200).json({ token });

  } catch (error) {
    res.status(401).json({ error: error.message });
  }
};
