// config/database.js
const { Sequelize } = require('sequelize');

const sequelize = new Sequelize({
    dialect: 'mysql',
    database: 'u219107056_fsa',
    username: 'u219107056_fsa',
    password: '5|dBBdQLfSQC',
    host: '82.180.142.153',
    port: '3306',
    logging: false // Disable logging
});


module.exports = sequelize;
