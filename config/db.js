const {
    Sequelize
} = require('sequelize')
require('dotenv').config()

const db = new Sequelize(process.env.DB_NAME, process.env.DB_USER, process.env.DB_PASSWORD, {
    host: process.env.DB_HOST,
    dialect: 'mysql',
    timezone: "+07:00"
});

try {
    db.authenticate();
    console.log('Koneksi database berhasil.');
} catch (error) {
    console.error('Koneksi database tidak berhasil : ', error);
}

module.exports = db;