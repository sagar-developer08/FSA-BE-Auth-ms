// app.js
const express = require('express');
const sequelize = require('./config/databaseConfig');
const authRoutes = require('./routes/authRoutes');
// const AWS = require('./config/awsConfig');
const app = express();

app.use(express.json());


// poll message

// const sqs = new AWS.SQS();
// const params = {
//   QueueUrl: 'https://sqs.ap-south-1.amazonaws.com/992382671249/fsa',
//   MaxNumberOfMessages: 10,
//   WaitTimeSeconds: 20,
// };

// const pollMessages = async () => {
//   try {
//     const data = await sqs.receiveMessage(params).promise();
//     if (data.Messages) {
//       for (const message of data.Messages) {
//         // Process incoming messages (if any)
//         console.log('Received message:', message.Body);
//       }
//     }
//   } catch (error) {
//     console.error('Error receiving messages:', error);
//   } finally {
//     setTimeout(pollMessages, 1000); // Poll messages every second
//   }
// };

app.get('/',(req,res)=>{
  res.status(200).json({
    message:"server responding"
  })
})

app.use('/api/auth', authRoutes);
// Sync database models with MySQL
sequelize.sync()
  .then(() => {
    console.log('Database synced successfully');
  })
  .catch((error) => {
    console.error('Error syncing database:', error);
  });

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});

// 
const awsServerlessExpress = require('aws-serverless-express');
const server = awsServerlessExpress.createServer(app)

module.exports.handler = (event, context) => awsServerlessExpress.proxy(server, event, context);

// 
