const { connection } = require('../../../config/connection');

const HospitalModel = {
    getAllHospitals(callback) {
        connection.query('SELECT * FROM hospital WHERE is_delete = 0', callback);
    },

    getHospitalById(hospitalid, callback) {
        connection.query('SELECT * FROM hospital WHERE hospitalid = ? AND is_delete = 0', [hospitalid], callback);
    },

    getHospitalByName(hospital_name, callback){
        connection.query('SELECT * FROM hospital WHERE hospital_name = ? AND is_delete = 0', [hospital_name], callback);
    },

    addHospital(hospital, callback) {
        const { hospital_name, Location , phonenumber, email } = hospital;
        const trndate = new Date().toISOString().slice(0, 19).replace('T', ' ');
        const defaultValues = 0;
        const activeValues = 1;
    
        const query = 'INSERT INTO hospital (hospital_name, Location, phonenumber , email , trndate, hospital_status, is_delete) VALUES (?, ?, ?, ?, ? ,? ,?)';
        const values = [hospital_name, Location, phonenumber , email , trndate, activeValues, defaultValues];
    
        connection.query(query, values, (error, results) => {
          if (error) {
            callback(error, null);
            return;
          }
    
          const hospitalid = results.insertId;
          callback(null, hospitalid);
        });
    },

    updateHospital(hospital, hospitalid, callback) {
        const { hospital_name, Location, phonenumber, email , hospital_status} = hospital;
        const query = 'UPDATE hospital SET hospital_name = ?, Location = ?, phonenumber = ?, email = ? , hospital_status = ? WHERE hospitalid = ?';
        const values = [hospital_name, Location, phonenumber, email , hospital_status, hospitalid];
    
        connection.query(query, values, callback);
    },

    deleteHospital(hospitalid, value, callback) {
        const query = 'UPDATE hospital SET is_delete = ? WHERE hospitalid = ?';
        const values = [value, hospitalid];
    
        connection.query(query, values, callback);
    },

}

module.exports = HospitalModel;