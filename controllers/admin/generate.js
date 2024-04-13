const response = require('express')
const modelKaryawan = require('../../models/karyawan')
const modelGenerate = require('../../models/generate_nama')
const modelDetailGenerate = require('../../models/detail_generate_nama')
const modelBagian = require('../../models/bagian')
const {
  Op
} = require('sequelize')

//generate
const generate = async (req, res) => {
  try {
    const id_admin = req.session.id_admin
    if (!id_admin) {
        return res.redirect('/loginAdmin')
    }
    const tanggal = new Date()
    const tahun = tanggal.getFullYear()

    const {
      periode
    } = req.body
    if (!periode) {
      return res.status(400).json({
        success: false,
        message: 'Silahkan isi bulan periode terlebih dahulu'
      })
    }

    const findPeriode = await modelGenerate.findOne({
      where: {
        periode: periode
      }
    })
    if (findPeriode) {
      return res.status(400).json({
        success: false,
        message: `Data pada periode ${periode} ${tahun} sudah ada`
      })
    }

    const findKaryawan = await modelKaryawan.findAll({
      attributes: ['id_karyawan', 'jabatan', 'nama'],
      where: {
        jabatan: {
          [Op.and]: [
            {
              [Op.notLike]: '%Kabag%'
            },
            {
              [Op.notLike]: '%Kepala%',
            }
          ]
        }
      },
      include: [{
        model: modelBagian,
        as: 'dataBagian',
        attributes: ['id_bagian', 'nama_bagian']
      }],
      raw: true
    })

    const findKabag = await modelKaryawan.findAll({
      attributes: ['id_karyawan', 'jabatan', 'nama'],
      where: {
        jabatan: {
          [Op.like]: '%Kabag%'
        }
      },
      include: [{
        model: modelBagian,
        as: 'dataBagian',
        attributes: ['id_bagian', 'nama_bagian']
      }],
      raw: true
    })

    const jumlahNamaMunculDiArray = (hasilNama, namaKaryawan) => {
      const jumlahMuncul = hasilNama[namaKaryawan] ? hasilNama[namaKaryawan].hasil.length : 0;
      return jumlahMuncul >= 6;
    }

    //acak nama data karyawan
    const getRandomNama = (karyawanArray) => {
      const randomIndex = Math.floor(Math.random() * karyawanArray.length);
      const randomPegawai = karyawanArray[randomIndex];
      karyawanArray.splice(randomIndex, 1); // Hapus elemen yang dipilih
      return randomPegawai;
    }
    const hasilNama = {}

    //generate tiap karyawan
    for (const karyawan of findKaryawan) {
      const namaKaryawan = karyawan['nama'];
      const idKaryawan = karyawan['id_karyawan'];
      const bagianKaryawan = karyawan['dataBagian.nama_bagian'];
    
      const hasilKaryawan = {
        idKaryawan,
        namaKaryawan,
        bagianKaryawan,
        hasil: [],
      };
    
      // 3 nama bagian sama
      const pegawaiSamaBagian = findKaryawan.filter(k => k['dataBagian.nama_bagian'] === bagianKaryawan);
      for (let index = 0; index < 3; index++) {
        let randomPegawai = getRandomNama(pegawaiSamaBagian);
        while (jumlahNamaMunculDiArray(hasilNama, randomPegawai.namaKaryawan) || randomPegawai.id_karyawan === idKaryawan) {
          randomPegawai = getRandomNama(pegawaiSamaBagian);
        }
        hasilKaryawan.hasil.push(randomPegawai ? randomPegawai : '');
      }
    
      // 2 nama bagian luar
      const pegawaiBedaBagian = findKaryawan.filter(k => k['dataBagian.nama_bagian'] !== bagianKaryawan);
      for (let index = 0; index < 2; index++) {
        let randomPegawai = getRandomNama(pegawaiBedaBagian);
        while (jumlahNamaMunculDiArray(hasilNama, randomPegawai.namaKaryawan) || randomPegawai.id_karyawan === idKaryawan) {
          randomPegawai = getRandomNama(pegawaiBedaBagian);
        }
        hasilKaryawan.hasil.push(randomPegawai ? randomPegawai : '');
      }
    
      hasilNama[namaKaryawan] = hasilKaryawan;
    
      // Anda dapat menambahkan logika untuk menentukan batas maksimal di sini
      if (jumlahNamaMunculDiArray(hasilNama, namaKaryawan)) {
        break; // Jika sudah mencapai batas maksimal
      }
    
      const addGenerate = await modelGenerate.create({
        id_karyawan: idKaryawan,
        id_admin: id_admin,
        periode: periode
      });
    
      const id_generate_nama = addGenerate.id_generate_nama;
    
      for (const detailNama of hasilKaryawan.hasil) {
        const addDetail = await modelDetailGenerate.create({
          id_generate_nama: id_generate_nama,
          hasil_generate_nama: detailNama.id_karyawan,
          status: 'belum selesai'
        });
      }
    }
    
    const hasilGenerateKabag = []

    for (let index = 0; index < findKabag.length; index++) {
      const idKaryawan = findKabag[index]['id_karyawan']
      const namaKaryawan = findKabag[index]['nama']
      const idBagian = findKabag[index]['dataBagian.id_bagian']
      console.log(`data karyawan ke ${index} : ${idKaryawan}`)
      console.log(`data bagian ke ${index} : ${idBagian}`)

      const findKaryawanBagian = await modelKaryawan.findAll({
        where: {
          [Op.and]: [{
              [Op.and]: [{
                  jabatan: {
                    [Op.notLike]: '%Kabag%',
                  },
                },
                {
                  jabatan: {
                    [Op.notLike]: '%kabag%',
                  },
                },
                {
                  jabatan: {
                    [Op.notLike]: '%Kepala%',
                  },
                },
              ],
            },
            {
              id_bagian: idBagian
            },
          ],
        },
      });

      const hasilKabag = {
        idKaryawan,
        idBagian,
        namaKaryawan,
        hasil: []
      }

      for (const karyawan of findKaryawanBagian) {
        hasilKabag.hasil.push({
          id_karyawan: karyawan.id_karyawan,
          nama: karyawan.nama, 
        });
      }
      hasilGenerateKabag.push(hasilKabag)
      const addGenerate = await modelGenerate.create({
        id_karyawan: idKaryawan,
        id_admin: id_admin,
        periode: periode
      })
      const id_generate_nama = addGenerate.id_generate_nama
      for (const detailHasil of hasilKabag.hasil) {
        const addDetail = await modelDetailGenerate.create({
          id_generate_nama: id_generate_nama,
          hasil_generate_nama: detailHasil.id_karyawan,
          status: 'belum selesai'
        })
      }
    }

    return res.status(200).json({
      success: true,
      message: 'generate berhasil'
    })

  } catch (error) {
    console.log(error)
    res.status(500).json({
      success: false,
      message: error
    })
  }
}

module.exports = {
  generate
}