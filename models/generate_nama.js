const {DataTypes} = require('sequelize')
const sequelize = require('../config/db')

const generate_nama = sequelize.define('generate_nama', {
    id_generate_nama:{
        type: DataTypes.UUID,
        allowNull: false,
        primaryKey: true,
        defaultValue: DataTypes.UUIDV4
    },
    id_karyawan:{
        type: DataTypes.UUID,
        allowNull: false,
    },
    id_admin:{
        type: DataTypes.UUID,
        allowNull: false
    },
    periode:{
        type: DataTypes.STRING(10),
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
    tableName: 'generate_nama',
    timeStamps: true,
    createdAt: 'created_at',
    updatedAt: 'updated_at'
})

module.exports = generate_nama