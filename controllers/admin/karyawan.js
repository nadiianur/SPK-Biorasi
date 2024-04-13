const response = require('express')
require('dotenv').config()
require('../../models/associations')
const modelKaryawan = require('../../models/karyawan')
const bcrypt = require('bcrypt')
const modelBagian = require('../../models/bagian')
const sequelize = require('sequelize')

//tambah karyawan
const tambahKaryawan = async (req,res) => {
    try {
        const {nip_karyawan, nama, golongan, jabatan, jenis_kelamin, email, password, role, bagian} = req.body

        if (!nip_karyawan || !nama || !jabatan || !jenis_kelamin || !password || !role || !bagian) {
            return res.status(400).json({ success: false, message: 'Silahkan Lengkapi Data Pegawai'})
        } 

        const findNip = await modelKaryawan.findOne({
            where:{
                nip_karyawan: nip_karyawan
            }
        })

        if (findNip) {
            return res.status(400).json({ success: false, message: 'NIP Pegawai sudah terdaftar'})
        }

        const salt = bcrypt.genSaltSync(10)
        const hashedPass = bcrypt.hashSync(password, salt)

        const tambahKaryawan = await modelKaryawan.create({
            nip_karyawan: nip_karyawan,
            nama: nama,
            golongan: golongan, 
            jabatan: jabatan,
            jenis_kelamin: jenis_kelamin,
            email: email,
            password: hashedPass,
            role: role,
            id_bagian: bagian
        })

        if (tambahKaryawan) {
            res.status(200).json({ success: true, message: 'Data Pegawai berhasil ditambahkan'})
        } else {
            res.status(400).json({ success: false, message: 'Data Pegawai tidak berhasil ditambahakan'})
        }
    } catch (error) {
        console.log(error)
        res.status(500).json({ success: false, message: error})
    }
}

//edit karyawan
const editKaryawan = async (req,res) => {
    try {
        const {id_karyawan} = req.params
        const findKaryawan = await modelKaryawan.findByPk(id_karyawan)

        const {nip_karyawan, nama, golongan, jabatan, jenis_kelamin, email, password, role, bagian} = req.body
        const findNip = await modelKaryawan.findOne({
            where:{nip_karyawan: nip_karyawan}
        })

        if (findNip && findNip !== findNip.nip_karyawan) {
            return res.status(400).json({success: false, message: 'NIP Pegawai sudah terdaftar'})
        }

        const salt = bcrypt.genSaltSync(10)
        const hashedPass = bcrypt.hashSync(password, salt)

        const updateKaryawan = await modelKaryawan.update({
            nip_karyawan: nip_karyawan || findKaryawan.nip_karyawan,
            nama: nama || findKaryawan.nama,
            id_bagian: bagian || findKaryawan.id_bagian,
            golongan: golongan || findKaryawan.golongan,
            jabatan: jabatan || findKaryawan.jabatan,
            jenis_kelamin: jenis_kelamin || findKaryawan.jenis_kelamin,
            email: email || findKaryawan.email,
            password: hashedPass || findKaryawan.password,
            role: role || findKaryawan.role
        }, {
            where:{
                id_karyawan: id_karyawan
            }
        })

        if (updateKaryawan) {
            res.status(200).json({success: true, message: 'Data Pegawai berhasil di ubah'})
        } else {
            res.status(400).json({success: false, message: 'Data Pegawai tidak berhasil di ubah'})
        }
    } catch (error) {
        console.log(error)
        res.status(500).json({success: false, message: error})
    }
}

//detail karyawan
const detailKaryawan = async (req,res) => {
    try {
        const {id_karyawan} = req.params
        const findKaryawan = await modelKaryawan.findByPk(id_karyawan)
        if (findKaryawan) {
            res.status(200).json({success:true, message:'Data Pegawai ditemukan', data:findKaryawan})
        } else {
            res.status(400).json({success:false, message:'Data Pegawai tidak ditemukan'})
        }
    } catch (error) {
        console.log(error)
        res.status(500).json({success:false, message:error})
    }
    
}
//tampil karyawan
const tampilKaryawan = async (req,res) => {
    try {
        const findAllKaryawan = await modelKaryawan.findAll({attributes: ['id_karyawan', 'nip_karyawan', 'nama', 'golongan', 'jabatan', 'jenis_kelamin'], include: [
            {
                model: modelBagian,
                as: 'dataBagian',
                attributes: ['id_bagian','nama_bagian']
            }
        ], order: [
            // Urutan berdasarkan jabatan
            // Prioritaskan 'Kepala Biro Organisasi'
            [sequelize.literal("CASE WHEN jabatan = 'Kepala Biro Organisasi' THEN 0 ELSE 1 END"), 'ASC'],
            // Lalu 'Kepala Bagian'
            [sequelize.literal("CASE WHEN jabatan = 'Kabag Tatalaksana' THEN 0 ELSE 1 END"), 'ASC'],
            [sequelize.literal("CASE WHEN jabatan = 'Kabag Reformasi Birokrasi dan Akuntabilit' THEN 0 ELSE 1 END"), 'ASC'],
            [sequelize.literal("CASE WHEN jabatan = 'Kabag Kelembagaan dan Analisis Jabatan' THEN 0 ELSE 1 END"), 'ASC'],
            // Sisanya diurutkan berdasarkan jabatan
            ['jabatan', 'ASC']
        ]})
        if (findAllKaryawan.length > 0) {
            res.status(200).json({success:true, message:'Data karyawan tersedia', data:findAllKaryawan})
        } else {
            res.status(400).json({success:false, message:'Data karyawan tidak tersedia'})
        }
    } catch (error) {
        console.log(error)
        res.status(500).json({success:false, message: error})
    }
}

//hapus karyawan
const hapusKaryawan = async (req,res) => {
    try {
        const {id_karyawan} = req.params
        const hapus = await modelKaryawan.destroy({
            where:{id_karyawan: id_karyawan}
        })
        if (hapus) {
            res.status(200).json({success:true, message:'Data Pegawai berhasil dihapus'})
        } else {
            res.status(400).json({success:false, message:'Data Pegawai tidak berhasil dihapus'})
        } 
    } catch (error) {
        console.log(error)
        res.status(500).json({success:false, message: error})
    }
}

module.exports = {tambahKaryawan, editKaryawan, detailKaryawan, tampilKaryawan, hapusKaryawan}