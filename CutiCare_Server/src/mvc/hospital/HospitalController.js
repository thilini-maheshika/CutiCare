const HospitalModel = require("./HospitalModel");

const getAllHospital = (req, res) => {
    HospitalModel.getAllHospitals((error, results) => {
      if (error) {
        res.status(500).send({ error: 'Error fetching data from the database' });
        return;
      }
  
      res.status(200).send(results);
    });
  };

  const getHospitalById = (req, res) => {
    const { hospitalid } = req.params;
    HospitalModel.getHospitalById(hospitalid, (error, results) => {
      if (error) {
        res.status(500).send({ error: 'Error fetching data from the database' });
        return;
      }
  
      if (results.length === 0) {
        res.status(404).send({ error: 'Hospital not found' });
        return;
      }
  
      res.status(200).send(results);
    });
  };

  const addHospital = (req, res) => {
    const hospital = req.body;
  
    HospitalModel.getHospitalByName(hospital.hospital_name, (error, results) => {
      if (error) {
        res.status(500).send({ error: 'Error fetching data from the database' });
        return;
      }
  
      if (results.length > 0) {
        res.status(409).send({ error: 'Hospital is already exists' });
        return;
      }
  
      HospitalModel.addHospital(hospital, (error, hospitalid) => {
        if (error) {
          res.status(500).send({ error: 'Error fetching data from the database' });
          return;
        }
  
        if (!hospitalid) {
          res.status(404).send({ error: 'Failed to add Hospital' });
          return;
        }
  
        res.status(200).send({ message: 'Hospital Added successfully', hospitalid });
      });
    });
  };

  const updateHospital = (req, res) => {
    const { hospitalid } = req.params;
    const hospital = req.body;
  
    HospitalModel.getHospitalById(hospitalid, (error, existingHospital) => {
  
      if (error) {
        res.status(500).send({ error: 'Error fetching data from the database' });
        return;
      }
  
      if (!existingHospital[0]) {
        res.status(404).send({ error: 'Hospital not found' });
        return;
      }
  
      // Check if the provided phone number is already associated with another user
      if (hospital.hospital_name && hospital.hospital_name !== existingHospital[0].hospital_name) { 
  
  
        HospitalModel.getHospitalByName(hospital.hospital_name, (error, results) => {
            if (error) {
                res.status(500).send({ error: 'Error fetching data from the database' });
                return;
            }
  
            if (results.length > 0) {
                res.status(409).send({ error: 'This Hospital name is already exists' });
                return;
            }
  
            updateExistingHospital(hospital, hospitalid);
        });
    } else {
        updateExistingHospital(hospital, hospitalid);
    }
  });
  
  function updateExistingHospital(hospital, hospitalid) {
    HospitalModel.updateHospital(hospital, hospitalid, (error, results) => {
        if (error) {
            res.status(500).send({ error: 'Error fetching data from the database' });
            return;
        }
  
        if (results.affectedRows === 0) {
            res.status(404).send({ error: 'Hospital Details not found or no changes made' });
            return;
        }
  
        res.status(200).send({ message: 'Hospital Details updated successfully' });
    });
  }
  };

  const deleteHospitalById = (req, res) => {
    const { hospitalid } = req.params;
  
    HospitalModel.getHospitalById(hospitalid, (error, results) => {
      if (error) {
        res.status(500).send({ error: 'Error fetching data from the database' });
        return;
      }
  
      if (results.length === 0) {
        res.status(404).send({ error: 'Hospital not found' });
        return;
      }
  
      HospitalModel.deleteHospital(hospitalid, 1, (error, results) => {
        if (error) {
          res.status(500).send({ error: 'Error updating deletion in the database' });
          return;
        }
  
        res.status(200).send({ message: 'Hospital deleted successfully' });
      });
    });
  };

  const deleteMultiHospitals = (req, res) => {

    const { hospitalIds } = req.body;

    console.log(hospitalIds);
  
    if (!Array.isArray(hospitalIds) || hospitalIds.length === 0) {
      res.status(400).send({ error: 'Invalid hospital IDs' });
      return;
    }
  
    let successCount = 0;
    let failCount = 0;
  
    for (const hospitalid of hospitalIds) {
      HospitalModel.getHospitalById(hospitalid, (error, results) => {
        if (error) {
          console.error(`Error fetching hospital with ID ${hospitalid}: ${error}`);
          failCount++;
        } else if (results.length === 0) {
          console.log(`Hospital with ID ${hospitalid} not found`);
          failCount++;
        } else {
          HospitalModel.deleteHospital(hospitalid, 1, (deleteError, deleteResult) => {
            if (deleteError) {
              console.error(`Error deleting hospital with ID ${hospitalid}: ${deleteError}`);
              failCount++;
            } else {
              successCount++;
              console.log(`Hospital with ID ${hospitalid} deleted successfully`);
            }
  
            // Check if all deletions have been processed
            if (successCount + failCount === hospitalIds.length) {
              const totalCount = hospitalIds.length;
              res.status(200).send({
                totalCount,
                successCount,
                failCount,
              });
            }
          });
        }
  
        // Check if all branches have been processed
        if (successCount + failCount === hospitalIds.length) {
          const totalCount = hospitalIds.length;
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
    getAllHospital,
    getHospitalById,
    addHospital,
    updateHospital,
    deleteHospitalById,
    deleteMultiHospitals,
  }