const response = require('express')
const modelGenerate = require('../../models/generate_nama')
const modelDetailGenerate = require('../../models/detail_generate_nama')
const modelKaryawan = require('../../models/karyawan')
const modelKriteria = require('../../models/kriteria')
const modelDetailKriteria = require('../../models/detail_kriteria')
const modelPenilaian = require('../../models/penilaian')
const modelDetailPenilaian = require('../../models/detail_penilaian')
const {fn, col} = require('sequelize')

//tampil nama karyawan yang akan dinilai
const tampilNama = async (req,res) => {
    try {
        const id_karyawan = req.session.id_karyawan
        if (!id_karyawan) {
            return res.redirect('/loginAdmin')
        }
        console.log("ia",id_karyawan);
        const tanggal = new Date()
        const tahunSekarang = tanggal.getFullYear().toString()
        const bulanSekarang = tanggal.getMonth() + 1
        const namaBulan = ['januari', 'februari', 'maret', 'april', 'mei', 'juni', 'juli', 'agustus', 'september', 'oktober', 'november', 'desember']
        const bulanKalimat = namaBulan[bulanSekarang-1]
        console.log("bulannya", bulanKalimat);
        const findNama = await modelGenerate.findAll({
            where:{
                id_karyawan: id_karyawan, 
                periode: bulanKalimat,
                created_at: tahunSekarang
            },
            include: [{
                model: modelDetailGenerate,
                as: 'dataDetailGenerate',
                attributes: ['id_detail_generate', 'status'],
                include: [{
                    model: modelKaryawan,
                    as: 'dataKaryawan',
                    attributes: ['nip_karyawan']
                }]
            },{
                model: modelKaryawan,
                as: 'dataKaryawan',
                attributes: []
            }],
            attributes: []

        })
        if (findNama.length == 0) {
            
            return res.status(400).json({success:true, message:'Nama Pegawai tidak berhasil ditampikan'})
        }
        return res.status(200).json({success:true, message: 'Nama Pegawai berhasil ditampilkan', data:findNama})

    } catch (error) {
        console.log(error)
        return res.status(500).json({success: false, message: error})
    }
    
}

// tampil data detail karyawan
const detailKaryawan = async (req,res) => {
    try {
        const {id_detail_generate} = req.params
        const findDetail = await modelDetailGenerate.findOne({
            where:{id_detail_generate:id_detail_generate},
            include: [{model: modelKaryawan, as:'dataKaryawan', attributes: ['nip_karyawan', 'nama', 'golongan']}],
            attributes: []
        })
        if (!findDetail) {
            return res.status(400).json({success:false, message:'Data tidak ditemukan'})
        }        
        return res.status(200).json({success:true, message:'Data ditemukan', data:findDetail})

    } catch (error) {
        console.log(error)
        return res.status(500).json({success:false, message:error})
    }
}

//tampil kriteria dan detail kriteria
const dataKriteria = async (req,res) => {
    try {
        console.log("puab");
        const findKriteria = await modelKriteria.findAll({
            include: [{model: modelDetailKriteria, as:'dataDetailKriteria', attributes: ['id_detail_kriteria', 'sub_penilaian1', 'sub_penilaian2', 'sub_penilaian3', 'sub_penilaian4', 'sub_penilaian5']}],
            attributes: ['id_kriteria', 'nama_kriteria']
        })
        if (!findKriteria) {
            return res.status(400).json({success:true, message:'Data kriteria tidak tersedia'})
        }        
        return res.status(200).json({success:true, message: 'Data kriteria ditemukan', data: findKriteria})
    } catch (error) {
        console.log(error)
        return res.status(500).json({success:false, message:error})
    }
}

//submit penilaian
const tambahPenilaian = async (req,res) => {
    try {
        const {id_detail_generate} = req.params
        console.log(id_detail_generate)
    
        let penilaian = {}
        const dataPenilaian = req.body
        
        if (!dataPenilaian) {
            return res.status(400).json({success:false, messsage: 'Tambahkan penilaian karyawan'})
        }
    
        if (!Array.isArray(dataPenilaian)) {
            return res.status(400).json({success:false, message: 'Data penilaian harus dalam bentuk araray'})
        }
        const tambahPenilaian = await modelPenilaian.create({id_detail_generate: id_detail_generate})
        const id_penilaian = tambahPenilaian.id_penilaian
    
        for (const item of dataPenilaian) {
            const {id_kriteria, nilai_kriteria} = item
    
            if (!penilaian[id_kriteria]) {
                penilaian[id_kriteria] = {
                    nilai_kriteria: 0,
                }
            }
    
            penilaian[id_kriteria].nilai_kriteria += nilai_kriteria
    
            const tambahDetail = await modelDetailPenilaian.create({
                id_penilaian: id_penilaian,
                id_kriteria: id_kriteria,
                nilai_kriteria: penilaian[id_kriteria].nilai_kriteria
            })
        }
        const updateStatusDetail = await modelDetailGenerate.update({status: 'selesai'}, {where:{id_detail_generate: id_detail_generate}})
        if (!updateStatusDetail) {
            return res.status(400).json({success:false, message: 'Data penilaian tidak berhasil diinputkan'})
        }
        return res.status(200).json({success:true, message: 'Data penilaian berhasil diinputkan'})        
    } catch (error) {
        console.log(error)
        return res.status(500).json({success:false, message:error})
    }
    
}


module.exports = {tampilNama, detailKaryawan, dataKriteria, tambahPenilaian}