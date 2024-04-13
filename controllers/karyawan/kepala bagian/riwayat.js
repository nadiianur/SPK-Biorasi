const response = require('express')
const modelPenilaian = require('../../../models/penilaian')
const modelDetailGenerate = require('../../../models/detail_generate_nama')
const modelKaryawan = require('../../../models/karyawan')
const modelGenerate = require('../../../models/generate_nama')
const {Sequelize} = require('sequelize')

//tampil hasil total penilaian berdasarkan divisi masing-masing kabag
const allPenilaianHistory = async (req,res) => {
  const id_karyawan = req.session.id_karyawan
  if (!id_karyawan) {
      return res.redirect('/loginAdmin')
  }
    const findBagian = await modelKaryawan.findByPk(id_karyawan)
    const {periode, tahun} = req.body
    if (!periode || !tahun) {
        return res.status(400).json({success:false, message:'Silahkan isi bulan dan tahun terlebih dahulu'})
    }
    const findPenilaian = await modelPenilaian.findAll({
        include: [
          {
            model: modelDetailGenerate,
            as: 'dataDetailGeneratePenilaian',
            attributes: ['id_detail_generate'],
            include: [
              {
                model: modelGenerate,
                as: 'dataGenerate',
                attributes: []
              },
              {
                model: modelKaryawan,
                as: 'dataKaryawan',
                attributes: ['id_karyawan','nip_karyawan', 'nama', 'golongan'],
                where: {
                    id_bagian: findBagian.id_bagian
                }
              }
            ]
          }
        ],
        attributes: [
            [
              Sequelize.literal('ROUND(SUM(nilai_akhir) / COUNT(nilai_akhir), 6)'), // Memasukkan ROUND untuk membulatkan nilai
              'nilai_rata_rata'
            ]
          ],
        group: ['dataDetailGeneratePenilaian.hasil_generate_nama'],
        where:{
            '$dataDetailGeneratePenilaian.dataGenerate.periode$': periode,
            '$dataDetailGeneratePenilaian.dataGenerate.created_at$': tahun            
        }
      });
    if (findPenilaian.length > 0) {
        return res.status(200).json({success: true, message: 'Data penilaian ditemukan', data: findPenilaian})
    }
    return res.status(400).json({success: false, message: 'Data penilaian belum tersedia'})
}


module.exports = {allPenilaianHistory}