const {DataTypes} = require('sequelize')
const sequelize = require('../config/db')

const karyawan = sequelize.define('karyawan', {
    id_karyawan:{
        type: DataTypes.UUID,
        allowNull: false,
        primaryKey: true,
        defaultValue: DataTypes.UUIDV4
    },
    nip_karyawan:{
        type: DataTypes.STRING(30),
        allowNull: false
    },
    nama:{
        type: DataTypes.STRING(50),
        allowNull: false
    },
    golongan:{
        type: DataTypes.STRING(10),
        allowNull: true
    },
    jabatan:{
        type: DataTypes.STRING(100),
        allowNull: false
    },
    jenis_kelamin:{
        type: DataTypes.STRING(15),
        allowNull: false
    },
    email:{
        type: DataTypes.STRING(100),
        allowNull: true,
    },
    password:{
        type: DataTypes.STRING(256),
        allowNull: false
    },
    foto:{
        type: DataTypes.STRING(256),
        allowNull: true,
    },
    role:{
        type: DataTypes.INTEGER(3),
        allowNull: false
    },
    id_bagian:{
        type: DataTypes.INTEGER,
        allowNull: true
    },
    created_at: {
        type: DataTypes.DATE,
        allowNull: false
    },
    updated_at:{
        type: DataTypes.DATE,
        allowNull: false
    }
}, {
    tableName: 'karyawan',
    timeStamps: true,
    createdAt: 'created_at',
    updatedAt: 'updated_at'
})

module.exports = karyawan