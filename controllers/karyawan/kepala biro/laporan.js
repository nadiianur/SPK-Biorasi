const response = require('express')
const modelPenilaian = require('../../../models/penilaian')
const modelDetailGenerate = require('../../../models/detail_generate_nama')
const modelGenerate = require('../../../models/generate_nama')
const modelKaryawan = require('../../../models/karyawan')
const modelKriteria = require('../../../models/kriteria')
const modelDetailPenilaian = require('../../../models/detail_penilaian')
const {Sequelize, Op} = require('sequelize')
const PizZip = require("pizzip");
const Docxtemplater = require("docxtemplater");
const fs = require("fs");
const path = require("path");
const { error } = require('console')

//tampil periode dan tahun
const periodeTahun = async (req,res) => {
  try {
    const findData = await modelGenerate.findAll({
      group:['periode', 'created_at'],
      attributes: ['periode', 'created_at']
    })
    if (!findData) {
      return res.status(400).json({success:false, message:'Data penilaian tidak ditemukan'})
    }
    return res.status(200).json({success:true, message: 'Data penilaian ditemukan', data: findData})    
  } catch (error) {
    console.log(error)
    return res.status(500).json({success:false, message:error})
  }
  
}

// tampil nilai akhir banget masing-masing pegawai
const nilaiAkhir = async (req,res) => {
  try {
    const {periode, tahun} = req.body
    console.log(periode)
    console.log(tahun)
    if (!periode || !tahun) {
      return res.status(400).json({success:false, message: 'Isikan bulan dan tahun terlebih dahulu'})
    }
    const findPenilaian = await modelPenilaian.findAll({
          where:{
            [Op.and] : {
              '$dataDetailGeneratePenilaian.dataGenerate.periode$': periode,
              '$dataDetailGeneratePenilaian.dataGenerate.created_at$': tahun
            }
          },
          include: [
            {
              model: modelDetailGenerate,
              as: 'dataDetailGeneratePenilaian',
              attributes: ['id_detail_generate'],
              include: [
                {
                  model: modelGenerate,
                  as: 'dataGenerate',
                  attributes: ['periode', 'created_at']
                },
                {
                  model: modelKaryawan,
                  as: 'dataKaryawan',
                  attributes: ['id_karyawan', 'nip_karyawan', 'nama', 'golongan']
                }
              ],
            }
          ],
          attributes: [
              [Sequelize.literal('SUM(nilai_akhir) / COUNT(nilai_akhir)'), 'nilai_rata_rata'],
          ],
          group: ['dataDetailGeneratePenilaian.hasil_generate_nama'],
          order: [[Sequelize.literal('nilai_rata_rata'), 'DESC']]
        });
        if (findPenilaian.length > 0) {
            return res.status(200).json({success: true, message: 'Data penilaian ditemukan', data: findPenilaian})
        }
        return res.status(400).json({success: false, message: 'Data penilaian tidak tersedia'})    
  } catch (error) {
    console.log(error)
    return res.status(500).json({success:false, message: error})    
  }
}
// detail penilaian masing-masing orang
const detailPenilaian = async (req,res) => {
  try {
    const {id_karyawan, periode, tahun} = req.params

    const findDetailPenilaian = await modelDetailPenilaian.findAll({
      where: {
        id_penilaian: {
          [Sequelize.Op.in]: Sequelize.literal(`
            (
              SELECT id_penilaian
              FROM penilaian
              WHERE id_detail_generate IN (
                SELECT id_detail_generate
                FROM detail_generate_nama
                WHERE hasil_generate_nama = '${id_karyawan}'
              )
              AND id_detail_generate IN (
                SELECT id_detail_generate
                FROM generate_nama
                WHERE periode = '${periode}' AND created_at = ${tahun}
              )
            )
          `)
        }
      },
      include: [
        {
          model: modelPenilaian,
          as: 'dataPenilaian',
          attributes: ['id_detail_generate'],
          include: [
            {
              model: modelDetailGenerate,
              as: 'dataDetailGeneratePenilaian',
              attributes: ['id_generate_nama'],
              include: [
                {
                  model: modelGenerate,
                  as: 'dataGenerate',
                  attributes: [],
                  include: [
                    {
                      model: modelKaryawan,
                      as: 'dataKaryawan',
                      attributes: []
                    }
                  ]
                },
                {
                  model: modelKaryawan,
                  as: 'dataKaryawan',
                  attributes: []
                }
              ]
            }
          ]
        },
        {
          model: modelKriteria,
          as: 'dataKriteriaPenilaian',
          attributes: ['nama_kriteria']
        }
      ],
      attributes: ['id_penilaian', 'id_kriteria', 'nilai_kriteria']
    });
  
    if (findDetailPenilaian.length > 0) {
      const formattedData = findDetailPenilaian.reduce((result, current) => {
        const idGenerate = current.dataPenilaian.dataDetailGeneratePenilaian.id_generate_nama;
        
        const existingGenerate = result.find(item => item.id_generate === idGenerate);
        if (existingGenerate) {
          existingGenerate.penilaian.push({
            nama_kriteria: current.dataKriteriaPenilaian.nama_kriteria,
            nilai_kriteria: current.nilai_kriteria
          });
        } else {
          result.push({
            id_generate: idGenerate,
            penilaian: [{
              nama_kriteria: current.dataKriteriaPenilaian.nama_kriteria,
              nilai_kriteria: current.nilai_kriteria
            }]
          });
        }
      
        return result;
      }, []);
      return res.status(200).json({success:true, message: 'Data penilaian ditemukan', data: formattedData})
    }
    return res.status(400).json({success:false, message: 'Data penilaian tidak ditemukan'})    
  } catch (error) {
    console.log(error)
    return res.status(500).json({success:false, message:error})
  }
  
}

// laporan keseluruhan
const generateLaporan = async (req,res) => {
  try {
    const {periode, tahun} = req.params
    const findPenilaian = await modelPenilaian.findAll({
      where:{
        [Op.and]: {
          '$dataDetailGeneratePenilaian.dataGenerate.periode$': periode,
          '$dataDetailGeneratePenilaian.dataGenerate.created_at$': tahun 
        } 
      },
      include: [
        {
          model: modelDetailGenerate,
          as: 'dataDetailGeneratePenilaian',
          attributes: ['id_detail_generate'],
          include: [
            {
              model: modelGenerate,
              as: 'dataGenerate',
              attributes: [],
            },
            {
              model: modelKaryawan,
              as: 'dataKaryawan',
              attributes: ['nip_karyawan', 'nama', 'golongan', 'jabatan']
            }
          ]
        }
      ],
      attributes: [
          [Sequelize.literal('SUM(nilai_akhir) / COUNT(nilai_akhir)'), 'nilai_rata_rata']
      ],
      group: ['dataDetailGeneratePenilaian.hasil_generate_nama', 'dataDetailGeneratePenilaian.dataKaryawan.nip_karyawan', 'dataDetailGeneratePenilaian.dataKaryawan.nama', 'dataDetailGeneratePenilaian.dataKaryawan.golongan', 'dataDetailGeneratePenilaian.dataKaryawan.jabatan'],
      order: [[Sequelize.literal('nilai_rata_rata'), 'DESC']]
    });  
    if (findPenilaian.length > 0) {
      const content = fs.readFileSync(
          path.resolve(__dirname, '../', '../', '../', 'public', 'docs', 'template', "LAPORAN_PENILAIAN_PEGAWAI.DOCX"),
          "binary"
      );
      
      const zip = new PizZip(content);
      
      const doc = new Docxtemplater(zip, {
          paragraphLoop: true,
          linebreaks: true,
      });
      
      const dataPegawai = [];
  
      for (let index = 0; index < findPenilaian.length; index++) {
        const nilaiRataRata = findPenilaian[index].dataValues.nilai_rata_rata
        const formatNilaiRata = parseFloat(nilaiRataRata).toFixed(6)
        const pegawaiData = {
          "No": index + 1,
          "NIP": findPenilaian[index].dataDetailGeneratePenilaian.dataKaryawan.nip_karyawan,
          "Nama": findPenilaian[index].dataDetailGeneratePenilaian.dataKaryawan.nama,
          "Golongan": findPenilaian[index].dataDetailGeneratePenilaian.dataKaryawan.golongan,
          "Jabatan": findPenilaian[index].dataDetailGeneratePenilaian.dataKaryawan.jabatan,
          "Total": formatNilaiRata
        };
        
        dataPegawai.push(pegawaiData);
      }    

      doc.render({
        "periode": periode,
        "tahun": tahun,
        "pegawai": dataPegawai
      });

      console.log(doc.getFullText());
      
      const buf = doc.getZip().generate({
          type: "nodebuffer",
          compression: "DEFLATE",
      });
      

      fs.writeFileSync(path.resolve(__dirname, '../', '../', '../', 'public', 'docs', 'generate', `Laporan Penilaian Pegawai Periode ${periode} Tahun ${tahun}.docx`), buf); 
      res.setHeader('Content-Disposition', `attachment; filename=Laporan Penilaian Pegawai Periode ${periode} Tahun ${tahun}.docx`);
      res.setHeader('Content-Type', 'application/vnd.openxmlformats-officedocument.wordprocessingml.document');
 
      res.send(buf);
    } else {
      return res.status(400).json({success:false, message:'Data penialaian tidak ditemukan'})    
    }
  } catch (error) {
    console.log(error)
    return res.status(500).json({success:false, message:error})
  } 
}

module.exports = {nilaiAkhir, periodeTahun, detailPenilaian, generateLaporan}