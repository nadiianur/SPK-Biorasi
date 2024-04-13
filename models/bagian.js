const {DataTypes} = require('sequelize')
const sequelize = require('../config/db')

const bagian = sequelize.define('bagian', {
    id_bagian:{
        type: DataTypes.INTEGER,
        allowNull: false,
        primaryKey: true,
        autoIncrement: true
    },
    nama_bagian:{
        type: DataTypes.STRING,
        allowNull: false
    }, 
    created_at:{
        type: DataTypes.DATE,
        allowNull: false
    },
    updated_at:{
        type: DataTypes.DATE,
        allowNull: false
    }
}, {
    tableName: 'bagian',
    timestamps: true,
    createdAt: 'created_at',
    updatedAt: 'updated_at'
})

module.exports = bagian