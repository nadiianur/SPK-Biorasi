const response = require('express')
const modelHasilAkhir = require('../../../models/hasil_akhir_terburuk')
const modelKaryawan = require('../../../models/karyawan')

const allPegawaiTerburuk = async (req,res) => {
    try {
        const findHasil = await modelHasilAkhir.findAll({
            include:[{
                model: modelKaryawan,
                as: 'dataKaryawanHasilTerburuk',
                attributes: ['nip_karyawan', 'nama', 'golongan']
            }],
            attributes: ['total_nilai', 'periode', 'created_at']
        })
        if (findHasil.length > 0) {
            return res.status(200).json({success:true, message:'Data pegawai terburuk tersedia', data: findHasil})
        } else {
            return res.status(400).json({success:false, message:'Data pegawai terburuk belum tersedia'})
        }        
    } catch (error) {
        console.log(error)
        return res.status(500).json({success:false, message:error})
    }

}

module.exports = {allPegawaiTerburuk}