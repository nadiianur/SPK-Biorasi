const response = require('express')
const modelPenilaian = require('../../models/penilaian')
const modelDetailPenilaian = require('../../models/detail_penilaian')
const modelDetailGenerate = require('../../models/detail_generate_nama')
const modelGenerate = require('../../models/generate_nama')
const modelKriteria = require('../../models/kriteria')
const modelKaryawan = require('../../models/karyawan')
const {Op, where, Model} = require('sequelize')

//perhitungan nilai akhir
const nilaiAkhir = async (req,res) => {
    try {
        const tanggal = new Date()
        const tahun = tanggal.getFullYear()
        console.log(tahun)
        const {periode} = req.body
        if (!periode) {
            return res.status(400).json({success:false, message:'Silahkan isi bulan periode terlebih dahulu'})
        }

        const findPenilaian = await modelPenilaian.findAll({
            where:{
                '$dataDetailGeneratePenilaian.dataGenerate.periode$':periode,
                '$dataDetailGeneratePenilaian.dataGenerate.created_at$':tahun
            },
            include: [
                {
                    model: modelDetailPenilaian,
                    as: 'dataDetailPenilaian'
                },
                {
                    model: modelDetailGenerate,
                    as: 'dataDetailGeneratePenilaian',
                    include: [
                        {
                            model: modelGenerate,
                            as: 'dataGenerate',
                        }
                    ]
                }
            ]
        })
        if (findPenilaian.length == 0) {
            return res.status(400).json({success:false, message:'Data penilaian tidak tersedia'})
        }        
        let totalPerKriteria =  {}
        let nilaiBobot = {} 
        let postififIdeal = {}
        let negatifIdeal = {}
        let totalNilaiPositif = {}
        let totalNilaiNegatif = {}

        const findKriteria = await modelKriteria.findAll()
        if (findKriteria == 0) {
            return res.status(400).json({success:false, message:'Data kriteria belum tersedia'})
        }

        for (let k = 0; k < findKriteria.length; k++) {
            const idKriteria = findKriteria[k].id_kriteria
            const totalKriteria = await modelDetailPenilaian.sum('nilai_kuadrat', {
                where:{
                    id_kriteria: idKriteria,
                    '$dataPenilaian.dataDetailGeneratePenilaian.dataGenerate.periode$': periode,
                    '$dataPenilaian.dataDetailGeneratePenilaian.dataGenerate.created_at$': tahun
                },
                include:[{
                    model: modelPenilaian,
                    as: 'dataPenilaian',
                    include: [{
                        model: modelDetailGenerate,
                        as: 'dataDetailGeneratePenilaian',
                        include: [{
                            model: modelGenerate,
                            as: 'dataGenerate'
                        }]
                    }]
                }]
            })
            const findPositifIdeal = await modelDetailPenilaian.max('nilai_terbobot', {
                where:{
                    id_kriteria: idKriteria,
                    '$dataPenilaian.dataDetailGeneratePenilaian.dataGenerate.periode$': periode,
                    '$dataPenilaian.dataDetailGeneratePenilaian.dataGenerate.created_at$': tahun
                },
                include:[{
                    model: modelPenilaian,
                    as: 'dataPenilaian',
                    include: [{
                        model: modelDetailGenerate,
                        as: 'dataDetailGeneratePenilaian',
                        include: [{
                            model: modelGenerate,
                            as: 'dataGenerate'
                        }]
                    }]
                }]
            })
            const findNegatifIdeal = await modelDetailPenilaian.min('nilai_terbobot', {
                where:{
                    id_kriteria: idKriteria,
                    '$dataPenilaian.dataDetailGeneratePenilaian.dataGenerate.periode$': periode,
                    '$dataPenilaian.dataDetailGeneratePenilaian.dataGenerate.created_at$': tahun
                },
                include:[{
                    model: modelPenilaian,
                    as: 'dataPenilaian',
                    include: [{
                        model: modelDetailGenerate,
                        as: 'dataDetailGeneratePenilaian',
                        include: [{
                            model: modelGenerate,
                            as: 'dataGenerate'
                        }]
                    }]
                }]
            })
            totalPerKriteria[idKriteria] = totalKriteria;
            nilaiBobot[idKriteria] = findKriteria[k].bobot_kriteria
            postififIdeal[idKriteria] = findPositifIdeal
            negatifIdeal[idKriteria] = findNegatifIdeal
        }
        console.log("Total per kriteria:", totalPerKriteria);
        console.log('nilai bobot', nilaiBobot )
        console.log('positif ideal', postififIdeal)
        console.log('negatif ideal', negatifIdeal)

        const updatePromises = [];

        for (let i = 0; i < findPenilaian.length; i++) {
            for (let j = 0; j < findPenilaian[i].dataDetailPenilaian.length; j++) {
                const idKriteriaPenilaian = findPenilaian[i].dataDetailPenilaian[j].id_kriteria
                if (!totalPerKriteria.hasOwnProperty(idKriteriaPenilaian)) {
                    return res.status(400).json({success:false, message:'Id kriteria tidak ada'})
                }
                const totalNilaiKriteria = totalPerKriteria[idKriteriaPenilaian]
                const nilaiBobotKriteria = nilaiBobot[idKriteriaPenilaian]
                const positifIdealKriteria = postififIdeal[idKriteriaPenilaian]
                const negatifIdealKriteria = negatifIdeal[idKriteriaPenilaian]
                // console.log(`total nilai kriteria : ${totalNilaiKriteria}`)
                // console.log(`nilai bobot kriteria : ${nilaiBobotKriteria}`)
                // console.log(`nilai positif ideal kriteria : ${positifIdealKriteria}`)

                // await modelDetailPenilaian.update({nilai_kuadrat: findPenilaian[i].dataDetailPenilaian[j].nilai_kriteria**2}, {where:{id_detail_penilaian: findPenilaian[i].dataDetailPenilaian[j].id_detail_penilaian}})

                const updatedPromise = await modelDetailPenilaian.update({
                    nilai_kuadrat: findPenilaian[i].dataDetailPenilaian[j].nilai_kriteria**2,
                    nilai_normalisasi: findPenilaian[i].dataDetailPenilaian[j].nilai_kriteria/Math.sqrt(totalNilaiKriteria),
                    nilai_terbobot: (findPenilaian[i].dataDetailPenilaian[j].nilai_kriteria/Math.sqrt(totalNilaiKriteria)) * nilaiBobotKriteria,
                    nilai_positif: (((findPenilaian[i].dataDetailPenilaian[j].nilai_kriteria/Math.sqrt(totalNilaiKriteria)) * nilaiBobotKriteria) - positifIdealKriteria) ** 2,
                    nilai_negatif: (((findPenilaian[i].dataDetailPenilaian[j].nilai_kriteria/Math.sqrt(totalNilaiKriteria)) * nilaiBobotKriteria) - negatifIdealKriteria) ** 2
                },{
                    where:{
                        id_detail_penilaian: findPenilaian[i].dataDetailPenilaian[j].id_detail_penilaian
                    }
                })
                updatePromises.push(updatedPromise)
            }
        }

        await Promise.all(updatePromises);

        for (let i = 0; i < findPenilaian.length; i++) {
            const idPenilaian = findPenilaian[i].id_penilaian
            const findPenilaianPositif = await modelDetailPenilaian.sum('nilai_positif', {
                where:{
                    id_penilaian: idPenilaian,
                    '$dataPenilaian.dataDetailGeneratePenilaian.dataGenerate.periode$': periode,
                    '$dataPenilaian.dataDetailGeneratePenilaian.dataGenerate.created_at$': tahun
                },
                include:[{
                    model: modelPenilaian,
                    as: 'dataPenilaian',
                    include: [{
                        model: modelDetailGenerate,
                        as: 'dataDetailGeneratePenilaian',
                        include: [{
                            model: modelGenerate,
                            as: 'dataGenerate'
                        }]
                    }]
                }]
            })
            const findPenilaianNegatif = await modelDetailPenilaian.sum('nilai_negatif', {
                where:{
                    id_penilaian: idPenilaian,
                    '$dataPenilaian.dataDetailGeneratePenilaian.dataGenerate.periode$': periode,
                    '$dataPenilaian.dataDetailGeneratePenilaian.dataGenerate.created_at$': tahun
                },
                include:[{
                    model: modelPenilaian,
                    as: 'dataPenilaian',
                    include: [{
                        model: modelDetailGenerate,
                        as: 'dataDetailGeneratePenilaian',
                        include: [{
                            model: modelGenerate,
                            as: 'dataGenerate'
                        }]
                    }]
                }]
            })
            totalNilaiPositif[idPenilaian] = findPenilaianPositif
            totalNilaiNegatif[idPenilaian] = findPenilaianNegatif

            await modelPenilaian.update({
                total_nilai_positif: Math.sqrt(totalNilaiPositif[idPenilaian]),
                total_nilai_negatif: Math.sqrt(totalNilaiNegatif[idPenilaian]),
                nilai_akhir: Math.sqrt(totalNilaiNegatif[idPenilaian])/(Math.sqrt(totalNilaiNegatif[idPenilaian]) + Math.sqrt(totalNilaiPositif[idPenilaian]))
            }, {
                where:{
                    id_penilaian:idPenilaian
                }
            })
            
        }
        const findNilaiAkhir = await modelPenilaian.findAll({
            attributes: ['id_penilaian', 'nilai_akhir'],
            where: {
                nilai_akhir: {
                  [Op.ne]: null,
                  [Op.not]: '' 
                }
            },
            include: [
                {
                    model: modelDetailPenilaian,
                    as: 'dataDetailPenilaian',
                    attributes: []
                },
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
                            attributes: ['nip_karyawan', 'nama', 'golongan']
                        }
                    ]
                }
            ],
            order: [['nilai_akhir', 'DESC']]
        })
        console.log('total nilai positif', totalNilaiPositif)
        console.log('total nilai negatif', totalNilaiNegatif)
        res.status(200).json({success:true, message:'Akumlulasi penilaian karyawan berhasil', data: findNilaiAkhir})

    } catch (error) {
        console.log(error)
        return res.status(500).json({success:false, message:error})
    }
    
}

module.exports = {nilaiAkhir}