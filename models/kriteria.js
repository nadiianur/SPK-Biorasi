const {DataTypes} = require('sequelize')
const sequalize = require('../config/db')

const kriteria = sequalize.define('kriteria', {
    id_kriteria:{
        type: DataTypes.UUID,
        primaryKey: true,
        allowNull: false,
        defaultValue: DataTypes.UUIDV4
    },
    nama_kriteria:{
        type: DataTypes.STRING,
        allowNull: false
    },
    bobot_kriteria:{
        type: DataTypes.INTEGER,
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
    tableName: 'kriteria',
    timeStamps: true,
    createdAt: 'created_at',
    updatedAt: 'updated_at'
})

module.exports = kriteria