const {DataTypes} = require('sequelize')
const sequalize = require('../config/db')

const penilaian = sequalize.define('penilaian', {
    id_penilaian:{
        type: DataTypes.UUID,
        allowNull: false,
        primaryKey: true,
        defaultValue: DataTypes.UUIDV4
    },
    id_detail_generate:{
        type: DataTypes.UUID,
        allowNull: false
    },
    total_nilai_positif:{
        type: DataTypes.DECIMAL(10,6),
        allowNull: true
    },
    total_nilai_negatif:{
        type: DataTypes.DECIMAL(10,6),
        allowNull: true
    },
    nilai_akhir:{
        type: DataTypes.DECIMAL(10,6),
        allowNull: true
    },
    created_at:{
        type: DataTypes.DATE,
        allowNull: false
    },
    updated_at:{
        type: DataTypes.DATE,
        allowNullL: false
    }
}, {
    tableName: 'penilaian',
    createdAt: 'created_at',
    updatedAt: 'updated_at',
    timeStamps: true
})

module.exports = penilaian