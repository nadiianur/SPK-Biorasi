const response = require('express')
const modelPegawai = require('../../models/karyawan')
const modelGenerate = require('../../models/generate_nama')
const modelDetailGenerate = require('../../models/detail_generate_nama')


//tampil status nilai berdasrkan bulan dipilih , tahun timestamp
const tampilStatus = async (req, res) => {
    try {
        const {periode} = req.body
        if (!periode) {
            return res.status(400).json({success: false, message: 'Silahkan pilih periode terlebih dahulu'})
        }
        const tanggal = new Date()
        const tahun = tanggal.getFullYear().toString()
        console.log(tahun);
        const findData = await modelPegawai.findAll({
            include: [
                {
                    model: modelGenerate,
                    as: 'dataGenerate',
                    attributes:['periode'],
                    where: {
                        periode: periode,
                        created_at: tahun
                    },
                    include: [
                        {
                            model: modelDetailGenerate,
                            as: 'dataDetailGenerate',
                            where: {
                                status: 'belum selesai'
                            },
                            attributes: []
                        }
                    ]
                }
            ],
            attributes: ['nama', 'nip_karyawan']
        })
        if (findData.length > 0) {
            return res.status(200).json({success: true, message: 'Data penilaian ditemukan', data: findData})
        } else {
            return res.status(400).json({success: false, message: 'Data penilaian tidak ditemukan'})
        }        
    } catch (error) {
        console.log(error)
        return res.status(500).json({success: false, message:error})
    }
    
}

module.exports = {tampilStatus}