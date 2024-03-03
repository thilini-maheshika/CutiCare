const express = require('express');

const { 
    addHospital,
    updateHospital,
    deleteHospitalById,
    deleteMultiHospitals,
    getAllHospital,
    getHospitalById,

} = require('../../mvc//hospital/HospitalController');
const { authenticateToken, authorizeValidateUser } = require('../../middlewares/userAuth');
const { authorizeAccessControll } = require('../../middlewares/userAccess');

module.exports = (config) => {
    const router = express.Router();

    //login and create
    router.post('/add', authorizeAccessControll , addHospital);
    router.get('/all', authenticateToken, getAllHospital);
    router.get('/fetch/:hospitalid', authorizeAccessControll, getHospitalById);

    router.put('/:hospitalid', authorizeAccessControll, updateHospital);
    router.put('/delete/:hospitalid', authorizeAccessControll, deleteHospitalById);
    router.delete('/delete', authorizeAccessControll, deleteMultiHospitals);

    return router;
};
