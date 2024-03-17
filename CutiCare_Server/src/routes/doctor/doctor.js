const express = require('express');

const { 
    addDoctor,
    updateDoctor,
    deleteDoctorById,
    deleteMultiDoctors,
    getAllDoctors,
    getDoctorById,

} = require('../../mvc/doctor/DoctorController');
const { authenticateToken, authorizeValidateUser } = require('../../middlewares/userAuth');
const { authorizeAccessControll } = require('../../middlewares/userAccess');
const { uploadProfile } = require('../../../config/fileUpload');

module.exports = (config) => {
    const router = express.Router();

    //login and create
    router.post('/add', uploadProfile.single('profileimage') , addDoctor);
    router.get('/all', getAllDoctors);
    router.get('/fetch/:doctorid', authorizeAccessControll, getDoctorById);

    router.use('/profileimage', express.static('src/uploads/profile/'));
    
    router.put('/:doctorid', authorizeAccessControll, updateDoctor);
    router.delete('/delete/:doctorid', deleteDoctorById);
    router.delete('/delete', authorizeAccessControll, deleteMultiDoctors);

    return router;
};
