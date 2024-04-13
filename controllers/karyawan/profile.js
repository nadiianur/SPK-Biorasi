const response = require('express')
const modelKaryawan = require('../../models/karyawan')
const multer = require('multer')
const path = require('path')
const controllers = {}

//detail akun
const detailAkun = async (req,res) => {
    try {
        const id_karyawan = req.session.id_karyawan
        if (!id_karyawan) {
            return res.redirect('/loginAdmin')
        }
        const findAkun = await modelKaryawan.findByPk(id_karyawan) 
        if (!findAkun) {
            return res.status(400).json({success: false, message: 'Akun tidak ditemukan'})
        }
        return res.status(200).json({success:true, message: 'Akun ditemukan', data: findAkun})         
    } catch (error) {
        console.log(error)
        return res.status(500).json({success:false, message: error})
    }
}
controllers.detailAkun = detailAkun

const storage = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, path.join(__dirname, '../', '../', 'public', 'images', 'karyawan'))
       
    },
    filename: function (req, file, cb) {
        cb(null, file.originalname)
    }
})

const fileFilter = function (req, file, cb) {
    const allowedTypes = ['image/jpeg', 'image/png'];
    if (!allowedTypes.includes(file.mimetype)) {
        const error = new multer.MulterError('Jenis File Tidak Di izinkan, Hanya JPEG dan PNG yg Di izinkan');
        error.message = 'Jenis File Tidak Di izinkan, Hanya JPEG dan PNG yg Di izinkan'
        return cb(error, false);
    }
    cb(null, true);
}

const upload = multer({
    storage: storage,
    fileFilter: fileFilter
});

const uploadd = upload.single('file')

//update akun
const updateProfileKaryawan = async (req,res) => {
    try {
        const id_karyawan = req.session.id_karyawan
        if (!id_karyawan) {
            return res.redirect('/loginAdmin')
        }
        const findAkun = await modelKaryawan.findOne({where: {id_karyawan: id_karyawan}})
        if (!findAkun) {
            return res.status(400).json({success: false, message: 'akun tidak ditemukan'})
        }
        const {nama, nip_karyawan, email, golongan, jabatan, jenis_kelamin, password_lama, password_baru} = req.body
        const foto = req.file

        let updateFoto = false
        let updatePassword = false
        let update //ini untuk foto dan password baru
        let update2 // ini untuk tidak foto dan pasword


        if (foto) {
            updateFoto = true
        } else {
            updateFoto = false
        }

        if (password_baru) {
            updatePassword = true
        } else {
            updatePassword = false
        }

        if (updateFoto) {
            if (updatePassword) {
                update = true
            } else {
                update = false
            }
        } else {
            if (updatePassword) {
                update2 = true
            } else {
                update2 = false
            }
        }

        if (update) {
            if (!password_lama) {
                return res.status(400).json({success:false, message:'Silahkan isi password lama anda terlebih dahulu'})
            }
            const passwordAsli = findAkun.password
            const passwordMatch = bcrypt.compareSync(password_lama, passwordAsli)
            if (!passwordMatch) {
                return res.status(400).json({success:false, message: 'Password lama anda salah'})
            }
            const salt = bcrypt.genSaltSync(10)
            const encryptPass = bcrypt.hashSync(password_baru, salt)
            if (nip_karyawan && nip_karyawan !== findAkun.nip_karyawan) {
                const findNip = await modelKaryawan.findOne({where:{id_karyawan: id_karyawan}})
                if (!findNip) {
                    await modelKaryawan.update({
                        nip_karyawan: nip_karyawan || findAkun.nip_karyawan,
                        jabatan: jabatan || findAkun.jabatan,
                        nama: nama || findAkun.nama,
                        email: email || findAkun.email,
                        golongan: golongan || findAkun.golongan,
                        jenis_kelamin: jenis_kelamin || findAkun.jenis_kelamin,
                        password: encryptPass,
                        foto: foto.originalname
                    }, {
                        where:{id_karyawan: id_karyawan}
                    })
                    return res.status(200).json({success:true, message: 'Data akun berhasil diperbaharui'})
                } else {
                    return res.status(400).json({success:false, message: 'NIP sudah terdaftar sebelumnya'})
                }
            } else {
                await modelKaryawan.update({
                    nip_karyawan: nip_karyawan || findAkun.nip_karyawan,
                    jabatan: jabatan || findAkun.jabatan,
                    nama: nama || findAkun.nama,
                    email: email || findAkun.email,
                    golongan: golongan || findAkun.golongan,
                    jenis_kelamin: jenis_kelamin || findAkun.jenis_kelamin,
                    password: encryptPass,
                    foto: foto.originalname
                }, {
                    where:{id_karyawan: id_karyawan}
                })
                return res.status(200).json({success:true, message: 'Data akun berhasil diperbaharui'})
            }
        } else if(update == false) {
            if (nip_karyawan && nip_karyawan !== findAkun.nip_karyawan) {
                const findNip = await modelKaryawan.findOne({where:{id_karyawan: id_karyawan}})
                if (!findNip) {
                    await modelKaryawan.update({
                        nip_karyawan: nip_karyawan || findAkun.nip_karyawan,
                        jabatan: jabatan || findAkun.jabatan,
                        nama: nama || findAkun.nama,
                        email: email || findAkun.email,
                        golongan: golongan || findAkun.golongan,
                        jenis_kelamin: jenis_kelamin || findAkun.jenis_kelamin,
                        foto: foto.originalname
                    }, {
                        where:{id_karyawan: id_karyawan}
                    })
                    return res.status(200).json({success:true, message: 'Data akun berhasil diperbaharui'})
                } else {
                    return res.status(400).json({success:false, message: 'NIP sudah terdaftar sebelumnya'})
                }
            } else {
                await modelKaryawan.update({
                    nip_karyawan: findAkun.nip_karyawan,
                    jabatan: jabatan || findAkun.jabatan,
                    nama: nama || findAkun.nama,
                    email: email || findAkun.email,
                    golongan: golongan || findAkun.golongan,
                    jenis_kelamin: jenis_kelamin || findAkun.jenis_kelamin,
                    foto: foto.originalname
                }, {
                    where:{id_karyawan: id_karyawan}
                })
                return res.status(200).json({success:true, message: 'Data akun berhasil diperbaharui'})
            }
        } else if(update2 == true){
            if (!password_lama) {
                return res.status(400).json({success:false, message:'Silahkan isi password lama anda terlebih dahulu'})
            }
            const passwordAsli = findAkun.password
            const passwordMatch = bcrypt.compareSync(password_lama, passwordAsli)
            if (!passwordMatch) {
                return res.status(400).json({success:false, message: 'Password lama anda salah'})
            }
            const salt = bcrypt.genSaltSync(10)
            const encryptPass = bcrypt.hashSync(password_baru, salt)
            if (nip_karyawan && nip_karyawan !== findAkun.nip_karyawan) {
                const findNip = await modelKaryawan.findOne({where:{id_karyawan: id_karyawan}})
                if (!findNip) {
                    await modelKaryawan.update({
                        nip_karyawan: nip_karyawan || findAkun.nip_karyawan,
                        jabatan: jabatan || findAkun.jabatan,
                        nama: nama || findAkun.nama,
                        email: email || findAkun.email,
                        golongan: golongan || findAkun.golongan,
                        jenis_kelamin: jenis_kelamin || findAkun.jenis_kelamin,
                        password: encryptPass,
                    }, {
                        where:{id_karyawan: id_karyawan}
                    })
                    return res.status(200).json({success:true, message: 'Data akun berhasil diperbaharui'})
                } else {
                    return res.status(400).json({success:false, message: 'NIP sudah terdaftar sebelumnya'})
                }
            } else {
                await modelKaryawan.update({
                    nip_karyawan: findAkun.nip_karyawan,
                    jabatan: jabatan || findAkun.jabatan,
                    nama: nama || findAkun.nama,
                    email: email || findAkun.email,
                    golongan: golongan || findAkun.golongan,
                    jenis_kelamin: jenis_kelamin || findAkun.jenis_kelamin,
                    password: encryptPass,
                }, {
                    where:{id_karyawan: id_karyawan}
                })
                return res.status(200).json({success:true, message: 'Data akun berhasil diperbaharui'})
            }            
        } else {
            if (nip_karyawan && nip_karyawan !== findAkun.nip_karyawan) {
                const findNip = await modelKaryawan.findOne({where:{nip_karyawan: nip_karyawan}})
                if (!findNip) {
                    await modelKaryawan.update({
                        nip_karyawan: nip_karyawan || findAkun.nip_karyawan,
                        jabatan: jabatan || findAkun.jabatan,
                        nama: nama || findAkun.nama,
                        email: email || findAkun.email,
                        golongan: golongan || findAkun.golongan,
                        jenis_kelamin: jenis_kelamin || findAkun.jenis_kelamin,
                    }, {
                        where:{id_karyawan: id_karyawan}
                    })
                    return res.status(200).json({success:true, message: 'Data akun berhasil diperbaharui'})
                } else {
                    return res.status(400).json({success:false, message: 'NIP sudah terdaftar sebelumnya'})
                }
            } else {
                await modelKaryawan.update({
                    nip_karyawan: findAkun.nip_karyawan,
                    jabatan: jabatan || findAkun.jabatan,
                    nama: nama || findAkun.nama,
                    email: email || findAkun.email,
                    golongan: golongan || findAkun.golongan,
                    jenis_kelamin: jenis_kelamin || findAkun.jenis_kelamin,
                }, {
                    where:{id_karyawan: id_karyawan}
                })
                return res.status(200).json({success:true, message: 'Data akun berhasil diperbaharui'})
            }                     
        }

    } catch (error) {
        console.log(error)
        return res.status(500).json({success:false, message:error})
    }
    
}
controllers.updateProfileKaryawan = [uploadd, updateProfileKaryawan]

module.exports = controllers