const DoctorModel = require("./DoctorModel");

const getAllDoctors = (req, res) => {
  DoctorModel.getAllDoctors((error, results) => {
    if (error) {
      res.status(500).send({ error: 'Error fetching data from the database' });
      return;
    }

    res.status(200).send(results);
  });
};

const getDoctorById = (req, res) => {
  const { doctorid } = req.params;
  DoctorModel.getDoctorById(doctorid, (error, results) => {
    if (error) {
      res.status(500).send({ error: 'Error fetching data from the database' });
      return;
    }

    if (results.length === 0) {
      res.status(404).send({ error: 'Doctor not found' });
      return;
    }

    res.status(200).send(results);
  });
};

const addDoctor = async (req, res) => {
  try {
    const doctor = req.body;
    const filePath = req.file.filename;

    const existingDoctor = await DoctorModel.getDoctorByName(doctor.doctor_name);

    if (existingDoctor.length > 0) {
      return res.status(409).send({ error: 'Doctor already exists' });
    }

    const doctorid = await DoctorModel.addDoctor(doctor, filePath);

    if (!doctorid) {
      return res.status(404).send({ error: 'Failed to add Doctor' });
    }

    res.status(200).send({ message: 'Doctor Added successfully', doctorid });
  } catch (error) {
    console.error(error);
    res.status(500).send({ error: 'Error fetching data from the database' });
  }
};


const updateDoctor = (req, res) => {
  const { doctorid } = req.params;
  const doctor = req.body;

  DoctorModel.getDoctorById(doctorid, (error, existingDoctor) => {

    if (error) {
      res.status(500).send({ error: 'Error fetching data from the database' });
      return;
    }

    if (!existingDoctor[0]) {
      res.status(404).send({ error: 'Doctor not found' });
      return;
    }

    // Check if the provided phone number is already associated with another user
    if (doctor.doctor_name && doctor.doctor_name !== existingDoctor[0].doctor_name) {


      DoctorModel.getDoctorByName(doctor.doctor_name, (error, results) => {
        if (error) {
          res.status(500).send({ error: 'Error fetching data from the database' });
          return;
        }

        if (results.length > 0) {
          res.status(409).send({ error: 'This Doctor name is already exists' });
          return;
        }

        updateExistingDoctor(doctor, doctorid);
      });
    } else {
      updateExistingDoctor(doctor, doctorid);
    }
  });

  function updateExistingDoctor(doctor, doctorid) {
    DoctorModel.updateDoctor(doctor, doctorid, (error, results) => {
      if (error) {
        res.status(500).send({ error: 'Error fetching data from the database' });
        return;
      }

      if (results.affectedRows === 0) {
        res.status(404).send({ error: 'Doctor Details not found or no changes made' });
        return;
      }

      res.status(200).send({ message: 'Doctor Details updated successfully' });
    });
  }
};

const deleteDoctorById = (req, res) => {
  const { doctorid } = req.params;

  DoctorModel.getDoctorById(doctorid, (error, results) => {
    if (error) {
      res.status(500).send({ error: 'Error fetching data from the database' });
      return;
    }

    if (results.length === 0) {
      res.status(404).send({ error: 'Doctor not found' });
      return;
    }

    DoctorModel.deleteDoctor(doctorid, 1, (error, results) => {
      if (error) {
        res.status(500).send({ error: 'Error updating deletion in the database' });
        return;
      }

      res.status(200).send({ message: 'Doctor deleted successfully' });
    });
  });
};

const deleteMultiDoctors = (req, res) => {

  const { doctorIds } = req.body;

  console.log(doctorIds);

  if (!Array.isArray(doctorIds) || doctorIds.length === 0) {
    res.status(400).send({ error: 'Invalid doctor IDs' });
    return;
  }

  let successCount = 0;
  let failCount = 0;

  for (const doctorid of doctorIds) {
    DoctorModel.getDoctorById(doctorid, (error, results) => {
      if (error) {
        console.error(`Error fetching doctor with ID ${doctorid}: ${error}`);
        failCount++;
      } else if (results.length === 0) {
        console.log(`Doctor with ID ${doctorid} not found`);
        failCount++;
      } else {
        DoctorModel.deleteDoctor(doctorid, 1, (deleteError, deleteResult) => {
          if (deleteError) {
            console.error(`Error deleting doctor with ID ${doctorid}: ${deleteError}`);
            failCount++;
          } else {
            successCount++;
            console.log(`Doctor with ID ${doctorid} deleted successfully`);
          }

          // Check if all deletions have been processed
          if (successCount + failCount === doctorIds.length) {
            const totalCount = doctorIds.length;
            res.status(200).send({
              totalCount,
              successCount,
              failCount,
            });
          }
        });
      }

      // Check if all branches have been processed
      if (successCount + failCount === doctorIds.length) {
        const totalCount = doctorIds.length;
        res.status(200).send({
          totalCount,
          successCount,
          failCount,
        });
      }
    });
  }
};

module.exports = {
  addDoctor,
  updateDoctor,
  deleteDoctorById,
  deleteMultiDoctors,
  getAllDoctors,
  getDoctorById,
}