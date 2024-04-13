const karyawan = require('./karyawan')
const admin = require('./admin')
const generate_nama = require('./generate_nama')
const detail_generate_nama = require('./detail_generate_nama')
const penilaian = require('./penilaian')
const detail_penilaian = require('./detail_penilaian')
const kriteria = require('./kriteria')
const detail_kriteria = require('./detail_kriteria')
const hasil_akhir_terbaik = require('./hasil_akhir_terbaik')
const bagian = require('./bagian')
const hasil_akhir_terburuk = require('./hasil_akhir_terburuk')

karyawan.hasMany(generate_nama, {foreignKey:'id_karyawan', as: 'dataGenerate'})
generate_nama.belongsTo(karyawan, {foreignKey: 'id_karyawan', as:'dataKaryawan'})
detail_generate_nama.belongsTo(karyawan, {foreignKey: 'hasil_generate_nama', as:'dataKaryawan'})

admin.hasMany(generate_nama, {foreignKey:'id_admin'})
generate_nama.belongsTo(admin, {foreignKey: 'id_admin'})

generate_nama.hasMany(detail_generate_nama, {foreignKey: 'id_generate_nama', as: 'dataDetailGenerate'})
detail_generate_nama.belongsTo(generate_nama, {foreignKey: 'id_generate_nama', as:'dataGenerate'})

penilaian.hasMany(detail_penilaian, {foreignKey: 'id_penilaian',  as:'dataDetailPenilaian'})
detail_penilaian.belongsTo(penilaian, {foreignKey: 'id_penilaian', as:'dataPenilaian'})
detail_penilaian.belongsTo(kriteria, {foreignKey: 'id_kriteria', as: 'dataKriteriaPenilaian'})
penilaian.belongsTo(detail_generate_nama, {foreignKey:'id_detail_generate', as:'dataDetailGeneratePenilaian'})

kriteria.hasMany(detail_kriteria, {foreignKey: 'id_kriteria', as: 'dataDetailKriteria'})
detail_kriteria.belongsTo(kriteria, {foreignKey: 'id_kriteria'})

admin.hasMany(hasil_akhir_terbaik, {foreignKey: 'id_admin'})
hasil_akhir_terbaik.belongsTo(admin, {foreignKey:'id_admin'})
karyawan.hasMany(hasil_akhir_terbaik, {foreignKey: 'id_karyawan', as: 'dataHasilAkhir'})
hasil_akhir_terbaik.belongsTo(karyawan, {foreignKey: 'id_karyawan', as: 'dataKaryawanHasil'})

admin.hasMany(hasil_akhir_terburuk, {foreignKey: 'id_admin'})
hasil_akhir_terburuk.belongsTo(admin, {foreignKey:'id_admin'})
karyawan.hasMany(hasil_akhir_terburuk, {foreignKey: 'id_karyawan', as: 'dataHasilAkhirTerburuk'})
hasil_akhir_terburuk.belongsTo(karyawan, {foreignKey: 'id_karyawan', as: 'dataKaryawanHasilTerburuk'})

bagian.hasMany(karyawan, {foreignKey: 'id_bagian', as: 'dataKaryawan'})
karyawan.belongsTo(bagian, {foreignKey: 'id_bagian', as: 'dataBagian'})