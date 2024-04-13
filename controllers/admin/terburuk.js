const response = require('express')
const modelPenilaian = require('../../models/penilaian')
const modelDetailGenerate = require('../../models/detail_generate_nama')
const modelGenerate = require('../../models/generate_nama')
const modelKaryawan = require('../../models/karyawan')
const modelHasilAkhir = require('../../models/hasil_akhir_terburuk')
const { Sequelize, Op } = require('sequelize')

//pegawai terbaik
const pegawaiTerburuk = async (req,res) => {
    try {
        const id_admin = req.session.id_admin
        if (!id_admin) {
            return res.redirect('/loginAdmin')
        }
        const {periode} = req.body
        const tanggal = new Date()
        const tahun = tanggal.getFullYear()
        const stringTahun = tahun.toString()
        console.log(`ini string tahun : ${tahun}`)
        const findPeriode = await modelPenilaian.findOne({
            where:{
                '$dataDetailGeneratePenilaian.dataGenerate.periode$': periode,
                '$dataDetailGeneratePenilaian.dataGenerate.created_at$': tahun
            },
            include:[
                {
                    model: modelDetailGenerate,
                    as: 'dataDetailGeneratePenilaian',
                    include:[
                        {
                            model: modelGenerate,
                            as: 'dataGenerate'
                        }
                    ]
                },
                
            ]
        })
        if (!periode) {
            return res.status(400).json({success:false, message:`Silahkan isi periode terlebih dahulu`})
        }
        if (!findPeriode) {
            return res.status(400).json({success:false, message:`Data penilaian dengan periode ${periode} tidak tersedia`})
        }
        const findHasilAkhir = await modelHasilAkhir.findOne({
            attributes: ['id_hasil_akhir', 'id_karyawan', 'periode', 'total_nilai'],
            where:{
                periode: periode,
                created_at: stringTahun 
            },
            include: [
                {
                    model: modelKaryawan,
                    as: 'dataKaryawanHasilTerburuk',
                    attributes: ['id_karyawan', 'nip_karyawan', 'nama', 'golongan', 'foto']
                }
            ]
        })
        if (findHasilAkhir) {
            const findPenilaian = await modelPenilaian.findAll({
                include: [
                  {
                    model: modelDetailGenerate,
                    as: 'dataDetailGeneratePenilaian',
                    attributes: ['id_detail_generate', 'created_at', 'hasil_generate_nama'],
                    include: [
                      {
                        model: modelGenerate,
                        as: 'dataGenerate',
                        attributes: ['id_generate_nama']
                      },
                      {
                        model: modelKaryawan,
                        as: 'dataKaryawan',
                        attributes: ['id_karyawan','nip_karyawan', 'nama', 'golongan', 'foto']
                      }
                    ]
                  }
                ],
                attributes: [
                    [Sequelize.literal('SUM(nilai_akhir) / COUNT(nilai_akhir)'), 'nilai_rata_rata']
                ],
                group: ['dataDetailGeneratePenilaian.hasil_generate_nama'],
                order: [[Sequelize.literal('nilai_rata_rata'), 'ASC']],
                limit: 1
              });
            if(!findPenilaian){
                return res.status(400).json({success: false, message: 'Data penilaian tidak ditemukan'})
            }
            for (let index = 0; index < findPenilaian.length; index++) {
                await modelHasilAkhir.update({
                    id_admin: id_admin,
                    id_karyawan: findPenilaian[index].dataDetailGeneratePenilaian.hasil_generate_nama,
                    periode: periode,
                    total_nilai: findPenilaian[index].dataValues.nilai_rata_rata
                }, {where:{id_hasil_akhir: findHasilAkhir.id_hasil_akhir}})
                
            }
            return res.status(200).json({success:true, message: `Data pegawai terburuk dengan periode ${periode} berhasil di update`})
        } else {
            const findPenilaian = await modelPenilaian.findAll({
                include: [
                  {
                    model: modelDetailGenerate,
                    as: 'dataDetailGeneratePenilaian',
                    attributes: ['id_detail_generate', 'created_at', 'hasil_generate_nama'],
                    include: [
                      {
                        model: modelGenerate,
                        as: 'dataGenerate',
                        attributes: ['id_generate_nama']
                      },
                      {
                        model: modelKaryawan,
                        as: 'dataKaryawan',
                        attributes: ['id_karyawan','nip_karyawan', 'nama', 'golongan', 'foto']
                      }
                    ]
                  }
                ],
                attributes: [
                    [Sequelize.literal('SUM(nilai_akhir) / COUNT(nilai_akhir)'), 'nilai_rata_rata']
                ],
                group: ['dataDetailGeneratePenilaian.hasil_generate_nama'],
                order: [[Sequelize.literal('nilai_rata_rata'), 'ASC']],
                limit: 1
              });
            if(!findPenilaian){
                return res.status(400).json({success: false, message: 'Data penilaian tidak ditemukan'})
            }
            for (let index = 0; index < findPenilaian.length; index++) {
                await modelHasilAkhir.create({
                    id_admin: id_admin,
                    id_karyawan: findPenilaian[index].dataDetailGeneratePenilaian.hasil_generate_nama,
                    periode: periode,
                    total_nilai: findPenilaian[index].dataValues.nilai_rata_rata
                })
                
            }
    
            return res.status(200).json({success:true, message:'Data penilaian ditemukan'})      
        }
        
          
    } catch (error) {
        console.log(error)
        return res.status(500).json({success:false, message:error})
    }
    
}

//riwayat pegawai terburuk
const allPegawaiTerburuk = async (req,res) => {
    const findTerburuk = await modelHasilAkhir.findAll({
        include: [
            {
                model: modelKaryawan,
                as: 'dataKaryawanHasilTerburuk',
                attributes: ['nip_karyawan', 'nama', 'golongan', 'foto']
            }
        ],
        attributes: ['periode', 'total_nilai', 'created_at']
    })
    if (findTerburuk.length > 0) {
        return res.status(200).json({success:true, message:'Data pegawai terburuk tersedia', data: findTerburuk})
    } else {
        return res.status(400).json({success:false, message: 'Data pegawai terburuk belum tersedia'})
    }
}

module.exports = {pegawaiTerburuk, allPegawaiTerburuk}