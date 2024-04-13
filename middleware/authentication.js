const jwt = require('jsonwebtoken')

const verifyTokenKaryawan = (req, res, next) => {
    const token = req.cookies.token;
    
    if (!token) {
        return res.redirect('/loginPegawai');
    }

    try {
        const decoded = jwt.verify(token, process.env.ACCESS_TOKEN_SECRET);
        req.karyawan = decoded.id_karyawan;
        const role = decoded.role;
        if (role === 0) {
            next();
        } else {
            return res.redirect('/loginPegawai');
        }

    } catch (error) {
        return res.redirect('/loginPegawai');
    }
};

const verifyTokenAdmin = (req, res, next) => {
    const token = req.cookies.token;
    
    if (!token) {
        return res.redirect('/loginAdmin');
    }

    try {
        const decoded = jwt.verify(token, process.env.ACCESS_TOKEN_SECRET);
        req.admin = decoded.id_admin;
        next();
    } catch (error) {
        return res.redirect('/loginAdmin');
    }
};

const verifyTokenKepala = (req, res, next) => {
    const token = req.cookies.token;

    if (!token) {
        return res.redirect('/loginKabir');
    }

    try {
        const decoded = jwt.verify(token, process.env.ACCESS_TOKEN_SECRET);
        req.karyawan = decoded.id_karyawan;
        const role = decoded.role;
        if (role === 1) {
            next();
        } else {
            return res.redirect('/loginKabir');
        }

    } catch (error) {
        return res.redirect('/loginKabir');
    }
};

const verifyTokenKabag = (req, res, next) => {
    console.log("enough");
    const token = req.cookies.token;
    if (!token) {
        return res.redirect('/loginKabag');
    }

    try {
        const decoded = jwt.verify(token, process.env.ACCESS_TOKEN_SECRET);
        req.karyawan = decoded.id_karyawan;
        const role = decoded.role;
        if (role === 2) {
            next();
        } else {
            return res.redirect('/loginKabag');
        }

    } catch (error) {
        return res.redirect('/loginKabag');
    }
};




module.exports = {
    verifyTokenAdmin,
    verifyTokenKaryawan,
    verifyTokenKepala,
    verifyTokenKabag
}