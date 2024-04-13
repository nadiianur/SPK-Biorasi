const response = require('express')
const modelAdmin = require('../../models/admin')
const multer = require('multer')
const bcrypt = require('bcrypt')
const path = require('path')
const controllers = {}

//tampil detail akun
const detailAkun = async (req,res) => {
    try {
        const id_admin = req.session.id_admin
        console.log("pol",id_admin);
        if (!id_admin) {
            return res.redirect('/loginAdmin')
        }
        const findAkun = await modelAdmin.findOne({where: {id_admin: id_admin}, attributes: ['id_admin', 'username', 'nama', 'nip_admin', 'email', 'golongan' ,'jenis_kelamin', 'foto']})
        if (!findAkun) {
            return res.status(400).json({success: false, message: 'Data akun tidak tersedia'})
        }        
        return res.status(200).json({success: true, message: 'Data akun ditemukan', data:findAkun})
    } catch (error) {
        console.log(error)
        return res.status(500).json({success: false, message: error})   
    }
}
controllers.detailAkun = detailAkun


const storage = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, path.join(__dirname, '../', '../', 'public', 'images', 'admin'))
       
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
const updateAkun = async (req,res) => {
    try {
        const id_admin = req.session.id_admin
        if (!id_admin) {
            return res.redirect('/loginAdmin')
        }
        const findAkun = await modelAdmin.findOne({where: {id_admin: id_admin}})
        if (!findAkun) {
            return res.status(400).json({success: false, message: 'akun tidak ditemukan'})
        }
        const {username, nama, nip_admin, email, golongan, jenis_kelamin, password_lama, password_baru} = req.body
        console.log(`username : ${username}`)
        console.log(`nip admin : ${nip_admin}`)
        console.log("nama", nama);
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
            if (nip_admin && nip_admin !== findAkun.nip_admin) {
                const findNip = await modelAdmin.findOne({where:{id_admin: id_admin}})
                if (!findNip) {
                    await modelAdmin.update({
                        nip_admin: nip_admin || findAkun.nip_admin,
                        username: username || findAkun.username,
                        nama: nama || findAkun.nama,
                        email: email || findAkun.email,
                        golongan: golongan || findAkun.golongan,
                        jenis_kelamin: jenis_kelamin || findAkun.jenis_kelamin,
                        password: encryptPass,
                        foto: foto.originalname
                    }, {
                        where:{id_admin: id_admin}
                    })
                    return res.status(200).json({success:true, message: 'Data akun berhasil diperbaharui'})
                } else {
                    return res.status(400).json({success:false, message: 'NIP sudah terdaftar sebelumnya'})
                }
            } else {
                await modelAdmin.update({
                    nip_admin: findAkun.nip_admin,
                    username: username || findAkun.username,
                    nama: nama || findAkun.nama,
                    email: email || findAkun.email,
                    golongan: golongan || findAkun.golongan,
                    jenis_kelamin: jenis_kelamin || findAkun.jenis_kelamin,
                    password: encryptPass,
                    foto: foto.originalname
                }, {
                    where:{id_admin: id_admin}
                })
                return res.status(200).json({success:true, message: 'Data akun berhasil diperbaharui'})
            }
        } else if(update == false) {
            if (nip_admin && nip_admin !== findAkun.nip_admin) {
                const findNip = await modelAdmin.findOne({where:{id_admin: id_admin}})
                if (!findNip) {
                    await modelAdmin.update({
                        nip_admin: nip_admin || findAkun.nip_admin,
                        username: username || findAkun.username,
                        nama: nama || findAkun.nama,
                        email: email || findAkun.email,
                        golongan: golongan || findAkun.golongan,
                        jenis_kelamin: jenis_kelamin || findAkun.jenis_kelamin,
                        foto: foto.originalname
                    }, {
                        where:{id_admin: id_admin}
                    })
                    return res.status(200).json({success:true, message: 'Data akun berhasil diperbaharui'})
                } else {
                    return res.status(400).json({success:false, message: 'NIP sudah terdaftar sebelumnya'})
                }
            } else {
                await modelAdmin.update({
                    nip_admin: findAkun.nip_admin,
                    username: username || findAkun.username,
                    nama: nama || findAkun.nama,
                    email: email || findAkun.email,
                    golongan: golongan || findAkun.golongan,
                    jenis_kelamin: jenis_kelamin || findAkun.jenis_kelamin,
                    foto: foto.originalname
                }, {
                    where:{id_admin: id_admin}
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
            if (nip_admin && nip_admin !== findAkun.nip_admin) {
                const findNip = await modelAdmin.findOne({where:{id_admin: id_admin}})
                if (!findNip) {
                    await modelAdmin.update({
                        nip_admin: nip_admin || findAkun.nip_admin,
                        username: username || findAkun.username,
                        nama: nama || findAkun.nama,
                        email: email || findAkun.email,
                        golongan: golongan || findAkun.golongan,
                        jenis_kelamin: jenis_kelamin || findAkun.jenis_kelamin,
                        password: encryptPass,
                    }, {
                        where:{id_admin: id_admin}
                    })
                    return res.status(200).json({success:true, message: 'Data akun berhasil diperbaharui'})
                } else {
                    return res.status(400).json({success:false, message: 'NIP sudah terdaftar sebelumnya'})
                }
            } else {
                await modelAdmin.update({
                    nip_admin: findAkun.nip_admin,
                    username: username || findAkun.username,
                    nama: nama || findAkun.nama,
                    email: email || findAkun.email,
                    golongan: golongan || findAkun.golongan,
                    jenis_kelamin: jenis_kelamin || findAkun.jenis_kelamin,
                    password: encryptPass,
                }, {
                    where:{id_admin: id_admin}
                })
                return res.status(200).json({success:true, message: 'Data akun berhasil diperbaharui'})
            }            
        } else {
            if (nip_admin && nip_admin !== findAkun.nip_admin) {
                const findNip = await modelAdmin.findOne({where:{nip_admin: nip_admin}})
                if (!findNip) {
                    await modelAdmin.update({
                        nip_admin: nip_admin || findAkun.nip_admin,
                        username: username || findAkun.username,
                        nama: nama || findAkun.nama,
                        email: email || findAkun.email,
                        golongan: golongan || findAkun.golongan,
                        jenis_kelamin: jenis_kelamin || findAkun.jenis_kelamin,
                    }, {
                        where:{id_admin: id_admin}
                    })
                    return res.status(200).json({success:true, message: 'Data akun berhasil diperbaharui'})
                } else {
                    return res.status(400).json({success:false, message: 'NIP sudah terdaftar sebelumnya'})
                }
            } else {
                await modelAdmin.update({
                    nip_admin: findAkun.nip_admin,
                    username: username || findAkun.username,
                    nama: nama || findAkun.nama,
                    email: email || findAkun.email,
                    golongan: golongan || findAkun.golongan,
                    jenis_kelamin: jenis_kelamin || findAkun.jenis_kelamin,
                }, {
                    where:{id_admin: id_admin}
                })
                return res.status(200).json({success:true, message: 'Data akun berhasil diperbaharui'})
            }                     
        }

    } catch (error) {
        console.log(error)
        return res.status(500).json({success:false, message:error})
    }
    
}
controllers.updateAkun = [uploadd, updateAkun]

module.exports = controllers
