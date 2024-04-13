const {DataTypes} = require('sequelize')
const sequalize = require('../config/db')

const hasil_akhir_terbaik = sequalize.define('hasil_akhir_terbaik', {
    id_hasil_akhir:{
        type: DataTypes.UUID,
        allowNull: false,
        primaryKey: true,
        defaultValue: DataTypes.UUIDV4
    },
    id_admin:{
        type: DataTypes.UUID,
        allowNull: false
    },
    id_karyawan:{
        type: DataTypes.UUID,
        allowNull: false
    },
    periode:{
        type: DataTypes.STRING(30),
        allowNull: false
    },
    total_nilai:{
        type: DataTypes.DECIMAL(10,6),
        allowNull: true
    },
    created_at:{
        type: DataTypes.DATE,
        allowNull: false
    },
    updated_at:{
        type: DataTypes.DATE,
        allowNull: false
    }
},{
    tableName: 'hasil_akhir_terbaik',
    timeStamps: true,
    createdAt: 'created_at',
    updatedAt: 'updated_at'
})

module.exports = hasil_akhir_terbaik