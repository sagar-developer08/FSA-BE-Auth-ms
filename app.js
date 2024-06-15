// app.js
const express = require('express');
const sequelize = require('./config/databaseConfig');
const authRoutes = require('./routes/authRoutes');
// const AWS = require('./config/awsConfig');
const cors = require('cors')
const app = express();

app.use(express.json());
app.use(cors())
// const { createSession, deleteSession, getSessionByUserId } = require('./sessionManager');

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
