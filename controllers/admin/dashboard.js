const response = require('express')
const modelKaryawan = require('../../models/karyawan')
const modelPenilaian = require('../../models/penilaian')
const modelHasilAkhir = require('../../models/hasil_akhir_terbaik')

// total pegawai
const totalPegawai = async (req,res) => {
    const total = await modelKaryawan.count()
    return res.status(200).json({success: true, message:'Total data ditemukan', total: total})
}
// total data penilaian
const penilaian = async (req,res) => {
    const total = await modelPenilaian.count()
    return res.status(400).json({success: true, message: 'Total data ditemukan', total: total})
}

// pegawai terbaik
const pegawaiTerbaik = async (req,res) => {
    
    const findPegawai = await modelHasilAkhir.findOne({
        attributes: [],
        order: [['created_at', 'DESC']],
        include: [
            {
                model: modelKaryawan,
                as: 'dataKaryawanHasil',
                attributes: ['nama', 'foto']
            }
        ]
    })

    if (!findPegawai) {
        return res.status(400).json({success:false, message:'Pegawai terbaik belum tersedia'})
    }
    return res.status(200).json({success:true, message:'Pegawai terbaik tersedia', data: findPegawai})
}

// total data pegawai terbaik
const totalPegawaiTerbaik = async(req,res) => {
    const totalTerbaik = await modelHasilAkhir.count()
    return res.status(200).json({success:true, message:'Data pegawai terbaik ditemukan', total: totalTerbaik})
}

module.exports = {totalPegawai, penilaian, pegawaiTerbaik, totalPegawaiTerbaik}