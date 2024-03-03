const express = require('express');

const { 
    addDoctorToHospital,
    // updateAssignedDoctor,
    // deleteHospitalById,
    // deleteMultiHospitals,
    getAllAssignedDoctors,
    getAssignedDoctorById,

} = require('../../mvc/doctor_assign/DoctorAssignController');
const { authenticateToken, authorizeValidateUser } = require('../../middlewares/userAuth');
const { authorizeAccessControll } = require('../../middlewares/userAccess');

module.exports = (config) => {
    const router = express.Router();

    //login and create
    router.post('/create', authorizeAccessControll , addDoctorToHospital);
    router.get('/all', authenticateToken, getAllAssignedDoctors);
    router.get('/fetch/:assignid', authorizeAccessControll, getAssignedDoctorById);

    // router.put('/:assignid', authorizeAccessControll, updateAssignedDoctor);
    // router.put('/delete/:hospitalid', authorizeAccessControll, deleteHospitalById);
    // router.delete('/delete', authorizeAccessControll, deleteAssignedDoctor);

    return router;
};
