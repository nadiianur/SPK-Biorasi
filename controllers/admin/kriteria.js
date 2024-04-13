const response = require('express')
const modelKriteria = require('../../models/kriteria')
const modelDetailKriteria = require('../../models/detail_kriteria');
const kriteria = require('../../models/kriteria');
const sequelize = require('sequelize')


const tambahDataSecaraAtomik = async (modelKriteria, dataKriteria, dataDetailKriteria) => {
    const transaction = await modelKriteria.sequelize.transaction();
  
    try {
      const kriteria = await modelKriteria.create(dataKriteria, { transaction });
  
      await modelDetailKriteria.create({
        id_kriteria: kriteria.id_kriteria,
        ...dataDetailKriteria
      }, { transaction });
  
      await transaction.commit();
      console.log('Data berhasil ditambahkan secara atomik.');
    } catch (error) {
      await transaction.rollback();
      console.error('Terjadi kesalahan:', error);
      throw error;
    }
  };
  
// tambah kriteria
const tambahKriteria = async (req,res) => {
    try {
        const {nama_kriteria, bobot_kriteria, sub_penilaian1, sub_penilaian2, sub_penilaian3, sub_penilaian4, sub_penilaian5} = req.body

        if (!nama_kriteria || !bobot_kriteria || !sub_penilaian1 || !sub_penilaian2 || !sub_penilaian3 || !sub_penilaian4 || !sub_penilaian5) {
            return res.status(400).json({success: false, message:'Lengkapi data kriteria'})
        }
    
        const findNama = await modelKriteria.findOne({
            where:{nama_kriteria: nama_kriteria}
        })
    
        if (findNama) {
            return res.status(400).json({success: false, message:'Kriteria sudah pernah ditambahkan'})
        }

        const findTotalBobot = await modelKriteria.sum('bobot_kriteria')
        console.log(findTotalBobot)

        const jumlah = parseInt(findTotalBobot) + parseInt(bobot_kriteria)
        console.log(jumlah)

        if (jumlah > 100) {
            return res.status(400).json({success: false, message: 'Gagal, total bobot kriteria keseluruhan melebihi 100'})
        } else {
            const dataKriteria = {
                nama_kriteria: nama_kriteria,
                bobot_kriteria: bobot_kriteria,
            };
          
              const dataDetailKriteria = {
                sub_penilaian1: sub_penilaian1,
                sub_penilaian2: sub_penilaian2,
                sub_penilaian3: sub_penilaian3,
                sub_penilaian4: sub_penilaian4,
                sub_penilaian5: sub_penilaian5,
    
              };
        
              tambahDataSecaraAtomik(modelKriteria, dataKriteria, dataDetailKriteria)
        
              res.status(200).json({success:true, message: 'Data kriteria berhasil ditambahkan'})            
        }
      
    } catch (error) {
        console.log(error)
        res.status(500).json({success: false, message: error})
    }

}

// tampil kriteria
// const tampilKriteria = async (req,res) => {
//     try {
//         const findAllKriteria = await modelKriteria.findAll({attributes: ['id_kriteria', 'nama_kriteria', 'bobot_kriteria' ]})   
//         if (findAllKriteria.length > 0) {
//             res.status(200).json({success:true, message:'Data kriteria tersedia', data: findAllKriteria})
//         } else {
//             res.status(400).json({success: false, message:'Data kriteria tidak tersedia', data: findAllKriteria})
//         }
//     } catch (error) {
//         console.log(error)
//         res.status(500).json({success:false, message: error})
//     }
// }
const tampilKriteria = async (req, res) => {
    try {
        const findAllKriteria = await modelKriteria.findAll({
            attributes: ['id_kriteria', 'nama_kriteria', 'bobot_kriteria', [sequelize.col('dataDetailKriteria.sub_penilaian1'), 'sub_penilaian1'], [sequelize.col('dataDetailKriteria.sub_penilaian2'), 'sub_penilaian2'], [sequelize.col('dataDetailKriteria.sub_penilaian3'), 'sub_penilaian3'], [sequelize.col('dataDetailKriteria.sub_penilaian4'), 'sub_penilaian4'], [sequelize.col('dataDetailKriteria.sub_penilaian5'), 'sub_penilaian5']],
            include: {
                model: modelDetailKriteria,
                as: 'dataDetailKriteria',
                attributes: []
            }
        });

        if (findAllKriteria.length > 0) {
            res.status(200).json({ success: true, message: 'Data kriteria tersedia', data: findAllKriteria });
        } else {
            res.status(400).json({ success: false, message: 'Data kriteria tidak tersedia', data: findAllKriteria });
        }
    } catch (error) {
        console.log(error);
        res.status(500).json({ success: false, message: error });
    }
}


// detail kriteria
const detailKriteria = async (req,res) => {
    try {
        const {id_kriteria} = req.params
        const findKriteria = await modelKriteria.findOne({
            where:{id_kriteria: id_kriteria},
            include:{model: modelDetailKriteria, as:'dataDetailKriteria', attributes: ['sub_penilaian1', 'sub_penilaian2', 'sub_penilaian3', 'sub_penilaian4', 'sub_penilaian5']},
            attributes: ['id_kriteria', 'nama_kriteria', 'bobot_kriteria']
        })
        if (!findKriteria) {
            return res.status(400).json({success: false, message: 'Data kriteria tidak ditemukan'})
        }

        res.status(200).json({success: true, message: 'Data kriteria ditemukan', data: findKriteria})
    } catch (error) {
        console.log(error)
        res.status(500).json({success:false, message:error})
    }
}

// edit kriteria
const editKriteria = async (req,res) => {
    try {
        const {id_kriteria} = req.params
        const {nama_kriteria, bobot_kriteria, sub_penilaian1, sub_penilaian2, sub_penilaian3, sub_penilaian4, sub_penilaian5} = req.body
    
        const findKriteria = await modelKriteria.findOne({
            where:{id_kriteria: id_kriteria},
            include:{model: modelDetailKriteria, as:'dataDetailKriteria'}
        })
    
        if (!findKriteria) {
            return res.status(400).json({success:false, message:'Data kriteria tidak ditemukan'})
        }

        const findTotalBobot = await modelKriteria.sum('bobot_kriteria', {
            where:{
                id_kriteria:{
                    [sequelize.Op.ne]: id_kriteria
                }
            }
        })

        const jumlah = parseInt(findTotalBobot) + parseInt(bobot_kriteria)

        if (jumlah > 100) {
            return res.status(400).json({success:false, message: 'Gagal, Total bobot kriteria keseluruhan melebihi 100'})
        } else {
            const updateKriteria = await modelKriteria.update({
                nama_kriteria: nama_kriteria || findKriteria.nama_kriteria,
                bobot_kriteria: bobot_kriteria || findKriteria.bobot_kriteria
            }, {
                where: {id_kriteria: id_kriteria}
            })
        
            const updateDetailKriteria = await modelDetailKriteria.update({
                sub_penilaian1: sub_penilaian1 || findKriteria.dataDetailKriteria.sub_penilaian1,
                sub_penilaian2: sub_penilaian2 || findKriteria.dataDetailKriteria.sub_penilaian2,
                sub_penilaian3: sub_penilaian3 || findKriteria.dataDetailKriteria.sub_penilaian3,
                sub_penilaian4: sub_penilaian4 || findKriteria.dataDetailKriteria.sub_penilaian4,
                sub_penilaian5: sub_penilaian5 || findKriteria.dataDetailKriteria.sub_penilaian5,
            }, {
                where:{id_kriteria: id_kriteria}
            })
        
            if (!updateKriteria && !updateDetailKriteria) {
                return res.status(400).json({success: false, message:'Data kriteria tidak berhasil diubah'})
            }
            res.status(200).json({success: true, message: 'Data kriteria berhasil diubah'})
        }
       
    } catch (error) {
        console.log(error)
        res.status(500).json({success: false, message:error})
    }
}

// hapus kriteria
const hapusKriteria = async(req,res) => {
    try {
        const {id_kriteria} = req.params
        const hapus = await modelKriteria.destroy({where:{id_kriteria:id_kriteria}})
        if (!hapus) {
            return res.status(400).json({success:false, message:'Data kriteria tidak berhasil dihapus'})
        }
        res.status(200).json({success: true, message: 'Data kriteria berhasil dihapus'})
    } catch (error) {
        console.log(error)
        res.status(500).json({success: false, message:error})
    }
}

module.exports = {tambahKriteria, tampilKriteria, detailKriteria, editKriteria, hapusKriteria}