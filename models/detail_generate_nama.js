const { DataTypes } = require('sequelize');
const sequelize = require('../config/db');

const DetailGenerateNama = sequelize.define('detail_generate_nama', {
    id_detail_generate: {
        type: DataTypes.UUID,
        allowNull: false, 
        primaryKey: true,
        defaultValue: DataTypes.UUIDV4
    },
    id_generate_nama: {
        type: DataTypes.UUID,
        allowNull: false
    },
    hasil_generate_nama: {
        type: DataTypes.UUID,
        allowNull: false
    },
    status:{
        type: DataTypes.STRING(20),
        allowNull: false
    },
    created_at: {
        type: DataTypes.DATE,
        allowNull: false
    },
    updated_at: {
        type: DataTypes.DATE,
        allowNull: false
    }
}, {
    tableName: 'detail_generate_nama', 
    timestamps: true, 
    createdAt: 'created_at',
    updatedAt: 'updated_at'
});

module.exports = DetailGenerateNama; 
