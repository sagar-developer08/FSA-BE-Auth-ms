// module.exports = {
//     secretKey: 'XXXYTHSRATAV',
//     expiresIn: '1h',
//     host:'redis-17936.c212.ap-south-1-1.ec2.redns.redis-cloud.com',
//     port:17936
//   };
  

module.exports = {
  redis: {
    host: 'redis-17936.c212.ap-south-1-1.ec2.redns.redis-cloud.com', // Change this to your Redis host
    port: 17936,        // Change this to your Redis port
    password: 'Flm2pRfLH6aiCxNeBSAV3ustjsBjZBBd'
  },
  session: {
    secret: 'XXXYTHSRATAV', // Replace with your secret
    resave: false,
    saveUninitialized: false,
    cookie: {
      secure: process.env.NODE_ENV === 'production', // Set to true in production
      httpOnly: true,
      maxAge: 1000 * 60 * 60 // 1 hour
    }
  },
  jwt: {
    secretKey: 'yourJwtSecretKey', // Replace with your JWT secret key
    expiresIn: '1h'
  }
};
