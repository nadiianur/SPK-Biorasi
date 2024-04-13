const {DataTypes} = require('sequelize')
const sequalize = require('../config/db')

const detail_kriteria = sequalize.define('detail_kriteria', {
    id_detail_kriteria:{
        type: DataTypes.UUID,
        primaryKey: true,
        allowNull: false,
        defaultValue: DataTypes.UUIDV4
    },
    id_kriteria:{
        type: DataTypes.UUID,
        allowNull: false
    },
    sub_penilaian1:{
        type: DataTypes.STRING(100),
        allowNull: false
    },
    sub_penilaian2:{
        type: DataTypes.STRING(100),
        allowNull: false
    },
    sub_penilaian3:{
        type: DataTypes.STRING(100),
        allowNull: false
    },
    sub_penilaian4:{
        type: DataTypes.STRING(100),
        allowNull: false
    },
    sub_penilaian5:{
        type: DataTypes.STRING(100),
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
    tableName: 'detail_kriteria',
    timeStamps: true,
    createdAt: 'created_at',
    updatedAt: 'updated_at'
})

module.exports = detail_kriteria