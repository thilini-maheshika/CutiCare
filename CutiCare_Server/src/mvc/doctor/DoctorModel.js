const { connection } = require('../../../config/connection');

const DoctorModel = {

    getAllDoctors(callback) {
        connection.query('SELECT * FROM doctor WHERE is_delete = 0', callback);
      },

    getDoctorByName(doctor_name, callback){
        connection.query('SELECT * FROM doctor WHERE doctor_name = ? AND is_delete = 0', [doctor_name], callback);
    },

    getDoctorById(doctorid, callback) {
        connection.query('SELECT * FROM doctor WHERE doctorid = ? AND is_delete = 0', [doctorid], callback);
    },

    addDoctor(doctor, callback) {
        const { doctor_name, specialty , phonenumber, profileimage } = doctor;
        const trndate = new Date().toISOString().slice(0, 19).replace('T', ' ');
        const defaultValues = 0;
        const activeValues = 1;
    
        const query = 'INSERT INTO doctor (doctor_name, specialty, phonenumber , profileimage , trndate, doctor_status, is_delete) VALUES (?, ?, ?, ?, ? ,? ,?)';
        const values = [doctor_name, specialty, phonenumber , profileimage , trndate, activeValues, defaultValues];
    
        connection.query(query, values, (error, results) => {
          if (error) {
            callback(error, null);
            return;
          }
    
          const doctorid = results.insertId;
          callback(null, doctorid);
        });
    },

    updateDoctor(doctor, doctorid, callback) {
        const { doctor_name, specialty, phonenumber, doctor_status} = doctor;
        const query = 'UPDATE doctor SET doctor_name = ?, specialty = ?, phonenumber = ?, doctor_status = ? WHERE doctorid = ?';
        const values = [doctor_name, specialty, phonenumber, doctor_status, doctorid];
    
        connection.query(query, values, callback);
    },

    deleteDoctor(doctorid, value, callback) {
        const query = 'UPDATE doctor SET is_delete = ? WHERE doctorid = ?';
        const values = [value, doctorid];
    
        connection.query(query, values, callback);
    },

}

module.exports = DoctorModel;