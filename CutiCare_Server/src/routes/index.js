const express = require('express');
const userRoute = require('./user/user');
const DoctorRoute = require('./doctor/doctor');
const HospitalRoute = require('./hospital/hospital');
const DoctorAssign = require('./doctor_assign/doctorAssign');

module.exports = (config) => {
  const router = express.Router();

  //access control routes
  router.use('/user', userRoute(config)); //admin user only
  router.use('/doctor', DoctorRoute(config));
  router.use('/hospital', HospitalRoute(config));
  // router.use('/doctor_assign', DoctorAssign(config));

  return router;
};