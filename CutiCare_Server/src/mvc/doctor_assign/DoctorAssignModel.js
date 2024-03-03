const { connection } = require('../../../config/connection');

const DoctorAssignModel = {

    getAllAssignedDoctors(callback){
        connection.query('SELECT * FROM doctor_assign', callback);
    },



    assignDoctor(assigndoctor, callback) {
        const { hospitalId , doctorid } = assigndoctor;
        // const adddate = new Date().toISOString().slice(0, 19).replace("T", " ");
        const activeValues = 1;
    
        const query =
          "INSERT INTO doctor_assign (hospitalId, doctorid, assign_status, trndate) VALUES (?, ?, ?, NOW())";
        const values = [
          hospitalId,
          doctorid,
          activeValues,
        //   adddate,
          
        ];
    
        connection.query(query, values, (error, results) => {
          if (error) {
            callback(error, null);
            return;
          }
    
          const assignDoctorId = results.insertId;
          callback(null, assignDoctorId);
        });
      },

      getAssignedDoctorById(assignid, callback) {
        connection.query(
          "SELECT * FROM doctor_assign WHERE assignid = ? ",
          [assignid],
          callback
        );
      },

}

module.exports = DoctorAssignModel;