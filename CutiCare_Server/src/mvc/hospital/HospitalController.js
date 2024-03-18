const HospitalModel = require("./HospitalModel");


const getAllHospital = async (req, res) => {
  const { page, pageSize } = req.query;

  const pageNumber = parseInt(page, 10);
  const itemsPerPage = parseInt(pageSize, 10);

  if (isNaN(pageNumber) || isNaN(itemsPerPage) || pageNumber < 0 || itemsPerPage <= 0) {
    return res.status(400).send({ error: "Invalid page or pageSize parameter" });
  }

  const offset = pageNumber * itemsPerPage;

  try {
    const { results, totalItems } = await HospitalModel.getAllHospital(offset, itemsPerPage);
    res.status(200).send({ data: results, totalItems });
  } catch (error) {
    res.status(500).send({ error: 'Error fetching data from the database' });
  }
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

const addHospital = async (req, res) => {
  try {
    const hospital = req.body;
    const filePath = req.file.filename;

    const existingHospital = await HospitalModel.getHospitalByName(hospital.hospital_name);

    if (existingHospital.length > 0) {
      return res.status(409).send({ error: 'Hospital already exists' });
    }

    const hospital_id = await HospitalModel.addHospital(hospital, filePath);

    if (!hospital_id) {
      return res.status(404).send({ error: 'Failed to add Hospital' });
    }

    res.status(200).send({ message: 'Hospital Added successfully', hospital_id });
  } catch (error) {
    console.error(error);
    res.status(500).send({ error: 'Error fetching data from the database' });
  }
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

const deleteHospitalById = async (req, res) => {
  const { hospital_id } = req.params;

  try {
    // Check if the hospital exists
    const hospital = await HospitalModel.getHospitalById(hospital_id);

    if (!hospital) {
      return res.status(404).send({ error: 'hospital not found' });
    }

    // Delete the hospital
    await HospitalModel.deleteHospital(hospital_id);

    // Send success response
    res.status(200).send({ message: 'hospital deleted successfully' });
  } catch (error) {
    // Handle errors
    console.error('Error deleting hospital:', error);
    res.status(500).send({ error: 'Error deleting hospital' });
  }
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