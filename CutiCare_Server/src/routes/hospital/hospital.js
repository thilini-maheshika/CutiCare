const express = require('express');

const { 
    addHospital,
    updateHospital,
    deleteHospitalById,
    deleteMultiHospitals,
    getAllHospital,
    getHospitalById,

} = require('../../mvc//hospital/HospitalController');
const { uploadProfile } = require('../../../config/fileUpload');

module.exports = (config) => {
    const router = express.Router();

    router.post('/add', uploadProfile.single('profileimage'), addHospital);
    router.get('/all', getAllHospital);
    router.delete('/delete/:hospitalid', deleteHospitalById);
    router.use('/profileimage', express.static('src/uploads/profile/'));

    return router;
};
