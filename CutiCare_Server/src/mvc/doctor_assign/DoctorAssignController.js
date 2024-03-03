const DoctorAssignModel = require('./DoctorAssignModel');

const getAllAssignedDoctors = (req, res) => {
    DoctorAssignModel.getAllAssignedDoctors((error, results) => {
      if (error) {
        res.status(500).send({ error: 'Error fetching data from the database' });
        return;
      }
  
      res.status(200).send(results);
    });
  };

const addDoctorToHospital = (req, res) => {
    const assigndoctor = req.body;
  
      DoctorAssignModel.assignDoctor(assigndoctor , (error, assignDoctorId) => {
        if (error) {
          res.status(500).send({ error: 'Error fetching data from the database' });
          console.log(error);
          return;
        }
  
        if (!assignDoctorId) {
          res.status(404).send({ error: 'Failed to assign Doctor' });
          return;
        }
  
        res.status(200).send({ message: 'Doctor assign successfully', assignDoctorId });
      });
  
  };

  const getAssignedDoctorById = (req, res) => {
    const { assignid } = req.params;
    DoctorAssignModel.getAssignedDoctorById(assignid, (error, results) => {
      if (error) {
        res.status(500).send({ error: 'Error fetching data from the database' });
        return;
      }
  
      if (results.length === 0) {
        res.status(404).send({ error: 'Assigned Doctor not found' });
        return;
      }
  
      res.status(200).send(results);
    });
  };

//   const updateAssignedDoctor = (req, res) => {
//     const { assignid } = req.params;
//     const assign = req.body;
  
//     AssignPermissionModel.getAssignPermissionById(assignid, (error, existingPermission) => {
//       if (error) {
//         res.status(500).send({ error: 'Error fetching data from the database' });
//         return;
//       }
  
//       if (!existingPermission[0]) {
//         res.status(404).send({ error: 'Assign permission not found' });
//         return;
//       }
  
//       if (assignPermission.permission_code && assignPermission.permission_code !== existingPermission[0].permission_code) { 
  
  
//         AssignPermissionModel.getPermissionByCode(assignPermission.permission_code, (error, results) => {
//             if (error) {
//                 res.status(500).send({ error: 'Error fetching data from the database' });
//                 return;
//             }
  
//             if (results.length > 0) {
//                 res.status(409).send({ error: 'this permission name is already exists' });
//                 return;
//             }
  
//             updateExistingPermission(assignPermission, assignid);
//         });
//     } else {
//         updateExistingPermission(assignPermission, assignid);
//     }
//   });
  
//   function updateExistingPermission(assignPermission, assignid) {
//     AssignPermissionModel.updateAssignPermission(assignPermission, assignid, (error, results) => {
//         if (error) {
//             res.status(500).send({ error: 'Error fetching data from the database' });
//             return;
//         }
  
//         if (results.affectedRows === 0) {
//             res.status(404).send({ error: 'permission not found or no changes made' });
//             return;
//         }
  
//         res.status(200).send({ message: 'permission updated successfully' });
//     });
//   }
//   };

module.exports = {
    addDoctorToHospital,
    getAllAssignedDoctors,
    getAssignedDoctorById,
    // updateAssignedDoctor,
}