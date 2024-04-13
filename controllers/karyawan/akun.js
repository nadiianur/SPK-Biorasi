const response = require('express')
const modelKaryawan = require('../../models/karyawan')
const bcrypt = require('bcrypt')
const jwt = require('jsonwebtoken')

const loginKaryawan = async (req,res) => {
    try {
        const {nip, password} = req.body
        if (!nip || !password) {
            return res.status(400).json({success:false, message:'Lengkapi data akun anda'})
        }
        const findAkun = await modelKaryawan.findOne({where:{nip_karyawan: nip}})
        if (!findAkun) {
            return res.status(400).json({success: false, message: 'NIP tidak ditemukan'})
        }
        console.log(findAkun.password)
    
        bcrypt.compare(password, findAkun.password, async(err, results) => {
            if (err || !results) {
                return res.status(400).json({success: false, message:'Password anda salah'})
            }
            const id_karyawan = findAkun.id_karyawan
            const role = findAkun.role
            const token = jwt.sign({
                id_karyawan, role
            },
            process.env.ACCESS_TOKEN_SECRET, {
                expiresIn: '1w'
            })

            req.session.id_karyawan = id_karyawan

            res.cookie('token', token, {
                httpOnly: true,
                maxAge: 7 * 24 * 60 * 60 * 1000, 
            });
    
            return res.status(200).json({success: true, message: 'Login berhasil', token, id_karyawan})
        })            
    } catch (error) {
        console.log(error)
        return res.status(500).json({success:false, message:error})
    }
}

//logout karyawan
const logoutKaryawan = async (req,res) => {
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

module.exports = {loginKaryawan, logoutKaryawan}