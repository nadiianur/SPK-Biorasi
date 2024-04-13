const {DataTypes} = require('sequelize')
const sequalize = require('../config/db')

const detail_penilaian = sequalize.define('detail_penilaian', {
    id_detail_penilaian:{
        type: DataTypes.UUID,
        primaryKey: true,
        allowNull: false,
        defaultValue: DataTypes.UUIDV4
    },
    id_penilaian:{
        type: DataTypes.UUID,
        allowNull: false
    },
    id_kriteria:{
        type: DataTypes.UUID,
        allowNull: false
    },
    nilai_kriteria:{
        type: DataTypes.INTEGER(1),
        allowNull: false
    },
    nilai_kuadrat:{
        type: DataTypes.INTEGER(3),
        allowNull: true
    },
    nilai_normalisasi:{
        type: DataTypes.DECIMAL(10,6),
        allowNull: true
    },
    nilai_terbobot:{
        type: DataTypes.DECIMAL(10,6),
        allowNull: true
    },
    nilai_positif:{
        type:DataTypes.DECIMAL(10,6),
        allowNull: true
    },
    nilai_negatif:{
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
    tableName: 'detail_penilaian',
    timeStamps: true,
    createdAt: 'created_at',
    updatedAt: 'updated_at'
})

module.exports = detail_penilaian