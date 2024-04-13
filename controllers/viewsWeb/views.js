const response = require('express')
const jwt = require('jsonwebtoken')
const controller = {}
const path = require('path')

const viewsBiorasi = async (req, res) => {
    res.render('index')
}
controller.viewsBiorasi = viewsBiorasi;

const viewsLoginAdmin = async (req, res) => {
    res.render('admin/login')
}
controller.viewsLoginAdmin = viewsLoginAdmin;

const viewsDashboard = async (req, res) => {

    res.render('admin/dashboard')
}
controller.viewsDashboard = viewsDashboard;

const viewsPenilaian = async (req, res) => {

    res.render('admin/penilaian')
}
controller.viewsPenilaian = viewsPenilaian;

const viewsKaryawan = async (req, res) => {

    res.render('admin/karyawan')
}
controller.viewsKaryawan = viewsKaryawan;

const viewsGenerateKaryawan = async (req, res) => {

    res.render('admin/generateKaryawan')
}
controller.viewsGenerateKaryawan = viewsGenerateKaryawan;

const tampilStatus = async (req, res) => {

    res.render('admin/statusPenilaian')
}
controller.tampilStatus = tampilStatus;

const viewsAkumulasiHasil = async (req, res) => {

    res.render('admin/akumulasiHasil')
}
controller.viewsAkumulasiHasil = viewsAkumulasiHasil;

const viewsKaryawanTerbaik = async (req, res) => {

    res.render('admin/karyawanTerbaik')
}
controller.viewsKaryawanTerbaik = viewsKaryawanTerbaik;

const viewsProfile = async (req, res) => {

    res.render('admin/profile')
}
controller.viewsProfile = viewsProfile;

const viewsForgotPass = async (req, res) => {

    res.render('admin/forgotPass')
}
controller.viewsForgotPass = viewsForgotPass;

const viewsChangePass = async (req, res) => {

    res.render('admin/changePass')
}
controller.viewsChangePass = viewsChangePass;

const viewsKaryawanTerburuk = async (req, res) => {

    res.render('admin/karyawanTerburuk')
}
controller.viewsKaryawanTerburuk = viewsKaryawanTerburuk;

const viewsLoginKabir = async (req, res) => {

    res.render('kepala_biro/login')
}
controller.viewsLoginKabir = viewsLoginKabir;

const viewsDashboardKabir = async (req, res) => {

    res.render('kepala_biro/dashboard')
}
controller.viewsDashboardKabir = viewsDashboardKabir;

const viewsPelaporanKabir = async (req, res) => {

    res.render('kepala_biro/pelaporan')
}
controller.viewsPelaporanKabir = viewsPelaporanKabir;

const viewsPegawaiTerbaikKabir = async (req, res) => {

    res.render('kepala_biro/karyawanTerbaik')
}
controller.viewsPegawaiTerbaikKabir = viewsPegawaiTerbaikKabir;

const viewsPegawaiTerburukKabir = async (req, res) => {

    res.render('kepala_biro/karyawanTerburuk')
}
controller.viewsPegawaiTerburukKabir = viewsPegawaiTerburukKabir;

const viewsProfileKabir = async (req, res) => {

    res.render('kepala_biro/updateProfile')
}
controller.viewsProfileKabir = viewsProfileKabir;

const viewsLoginKabag = async (req, res) => {

    res.render('kepala_bagian/login')
}
controller.viewsLoginKabag = viewsLoginKabag;

const viewsProfileKabag = async (req, res) => {

    res.render('kepala_bagian/profile')
}
controller.viewsProfileKabag = viewsProfileKabag;

const viewsDashboardKabag = async (req, res) => {

    res.render('kepala_bagian/dashboard')
}
controller.viewsDashboardKabag = viewsDashboardKabag;

const viewsPenilaianKabag = async (req, res) => {

    res.render('kepala_bagian/penilaian')
}
controller.viewsPenilaianKabag = viewsPenilaianKabag;

const viewsRiwayatAkumulasiKabag = async (req, res) => {

    res.render('kepala_bagian/riwayatAkumulasi')
}
controller.viewsRiwayatAkumulasiKabag = viewsRiwayatAkumulasiKabag;

const viewsFormPenilaianKabag = async (req, res) => {

    res.render('kepala_bagian/formPenilaian')
}
controller.viewsFormPenilaianKabag = viewsFormPenilaianKabag;

const viewsLoginPegawai = async (req, res) => {

    res.render('karyawan/login')
}
controller.viewsLoginPegawai = viewsLoginPegawai;

const viewsHomePegawai = async (req, res) => {

    res.render('karyawan/home')
}
controller.viewsHomePegawai = viewsHomePegawai;

const viewsFormPenilaianPegawai = async (req, res) => {

    res.render('karyawan/formPenilaian')
}
controller.viewsFormPenilaianPegawai = viewsFormPenilaianPegawai;

const viewsProfileKaryawan = async (req, res) => {

    res.render('karyawan/profile')
}
controller.viewsProfileKaryawan = viewsProfileKaryawan;






module.exports = controller