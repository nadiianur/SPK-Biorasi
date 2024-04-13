const response = require('express')
require('dotenv').config()
require('../../models/associations')
const modelAdmin = require('../../models/admin')
const jwt = require('jsonwebtoken')
const bcrypt = require('bcrypt')
const {
    Op
} = require('sequelize')

//tambah admin
const tambahAdmin = async (req, res) => {
    try {
        const {
            username,
            nama,
            nip_admin,
            email,
            golongan,
            jenis_kelamin,
            password
        } = req.body

        if (!nama || !email || !password || !username) {
            return res.status(400).json({
                success: false,
                message: 'Silahkan Lengkapi Data Pegawai'
            })
        }

        const salt = bcrypt.genSaltSync(10)
        const hashedPass = bcrypt.hashSync(password, salt)

        const tambahAdmin = await modelAdmin.create({
            nip_admin: nip_admin,
            nama: nama,
            golongan: golongan,
            jenis_kelamin: jenis_kelamin,
            email: email,
            password: hashedPass,
            username: username
        })

        if (tambahAdmin) {
            res.status(200).json({
                success: true,
                message: 'Data admin berhasil ditambahkan'
            })
        } else {
            res.status(400).json({
                success: false,
                message: 'Data admin tidak berhasil ditambahkan'
            })
        }
    } catch (error) {
        console.log(error)
        res.status(500).json({
            success: false,
            messgae: error
        })
    }
}

const loginAdmin = async (req, res) => {
    try {
        const {
            username,
            password
        } = req.body

        if (!username || !password) {
            return res.status(400).json({
                success: false,
                message: 'Lengkapi data akun anda'
            })
        }

        const findAdmin = await modelAdmin.findOne({
            where: {
                username: username
            }
        })
        if (!findAdmin) {
            return res.status(400).json({
                success: false,
                message: 'Username tidak ditemukan'
            })
        }

        bcrypt.compare(password, findAdmin.password, async (err, results) => {
            if (err || !results) {
                return res.status(400).json({
                    success: false,
                    message: 'Password anda salah'
                })
            }
            const id_admin = findAdmin.id_admin

            const token = jwt.sign({
                    username,
                    id_admin
                },
                process.env.ACCESS_TOKEN_SECRET, {
                    expiresIn: '1w'
                }

            );

            req.session.id_admin = id_admin

            res.cookie('token', token, {
                httpOnly: true,
                maxAge: 7 * 24 * 60 * 60 * 1000, 
            });

            res.status(200).json({
                success: true,
                message: 'Login berhasil',
                token,
                id_admin
            })
        })
    } catch (error) {
        console.log(error)
        return res.status(500).json({
            success: false,
            message: error
        })
    }

}

//logout admin
const logoutAdmin = async (req, res) => {
    try {
        req.session.destroy((err) => {
            if (err) {
                console.log(err);
                return res.status(500).json({
                    success: false,
                    message: 'Gagal logout',
                });
            }
    
            res.clearCookie('sessionID');
            res.clearCookie('token');
            return res.status(200).json({
                success: true,
                message: 'Logout berhasil',
            });
        });
    } catch (error) {
        console.log(error)
        return res.status(500).json({
            success: false,
            message: error
        })
    }
}

//forgot password 
const forgotPassword = async (req, res) => {
    try {
        const {
            username,
            email,
            nip_admin
        } = req.body
        if (!username || !email || !nip_admin) {
            return res.status(400).json({
                succes: false,
                message: 'Silahkan lengkapi isian berikut'
            })
        }
        const findAkun = await modelAdmin.findOne({
            where: {
                [Op.and]: {
                    username: username,
                    email: email,
                    nip_admin: nip_admin
                }
            }
        })
        if (!findAkun) {
            return res.status(400).json({
                succes: false,
                message: 'Akun tidak ditemukan'
            })
        }
        return res.status(200).json({
            succes: true,
            message: 'Akun ditemukan',
            id_admin: findAkun.id_admin
        })

    } catch (error) {
        console.log(error)
        return res.status(500).json({
            succes: false,
            message: error
        })
    }

}

const confirmPassword = async (req, res) => {
    try {
        const {
            id_admin
        } = req.params
        const {
            new_password,
            confirm_new
        } = req.body
        if (!new_password || !confirm_new) {
            return res.status(400).json({
                succes: false,
                message: 'Lengkapi isian data'
            })
        }
        if (new_password == confirm_new) {
            const salt = bcrypt.genSaltSync(10)
            const hashedPass = bcrypt.hashSync(new_password, salt)
            await modelAdmin.update({
                password: hashedPass
            }, {
                where: {
                    id_admin: id_admin
                }
            })
            return res.status(200).json({
                succes: true,
                message: 'Password telah diperbaharui'
            })
        }
        return res.status(400).json({
            succes: false,
            message: 'Password baru tidak sama dengan konfirmasi'
        })
    } catch (error) {
        console.log(error);
        return res.status(500).json({
            succes: false,
            message: error
        })
    }
}

module.exports = {
    tambahAdmin,
    loginAdmin,
    logoutAdmin,
    forgotPassword,
    confirmPassword
}