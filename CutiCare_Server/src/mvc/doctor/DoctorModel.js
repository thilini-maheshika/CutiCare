const { connection } = require('../../../config/connection');
const util = require('util');
const queryAsync = util.promisify(connection.query).bind(connection);

const DoctorModel = {

    getAllDoctors: async (offset, itemsPerPage) => {
        try {
            const query = `SELECT * FROM doctor WHERE is_delete = 0 LIMIT ? OFFSET ?`;
            const results = await queryAsync(query, [itemsPerPage, offset]);
            const totalItemsResults = await queryAsync("SELECT COUNT(*) as total FROM doctor WHERE is_delete = 0");
            const totalItems = totalItemsResults[0].total;

            return { results, totalItems };
        } catch (error) {
            throw error;
        }
    },

    getDoctorByName: async (doctor_name) => {
        try {
            const results = await queryAsync('SELECT * FROM doctor WHERE doctor_name = ? AND is_delete = 0', [doctor_name]);
            return results;
        } catch (error) {
            throw error;
        }
    },

    getDoctorById: async (doctorid) => {
        try {
            const results = await queryAsync('SELECT * FROM doctor WHERE doctorid = ? AND is_delete = 0', [doctorid]);
            return results;
        } catch (error) {
            throw error;
        }
    },

    addDoctor: async (doctor, filePath) => {
        try {
            const { doctor_name, specialty, phonenumber } = doctor;
            const trndate = new Date().toISOString().slice(0, 19).replace('T', ' ');
            const defaultValues = 0;
            const activeValues = 1;

            const query = 'INSERT INTO doctor (doctor_name, specialty, phonenumber, profileimage, trndate, doctor_status, is_delete) VALUES (?, ?, ?, ?, ?, ?, ?)';
            const values = [doctor_name, specialty, phonenumber, filePath, trndate, activeValues, defaultValues];

            const results = await queryAsync(query, values);

            const doctorid = results.insertId;
            return doctorid;
        } catch (error) {
            throw error;
        }
    },

    updateDoctor: async (doctor, doctorid) => {
        try {
            const { doctor_name, specialty, phonenumber, doctor_status } = doctor;
            const query = 'UPDATE doctor SET doctor_name = ?, specialty = ?, phonenumber = ?, doctor_status = ? WHERE doctorid = ?';
            const values = [doctor_name, specialty, phonenumber, doctor_status, doctorid];

            await queryAsync(query, values);
        } catch (error) {
            throw error;
        }
    },

    deleteDoctor: async (doctorid, value) => {
        try {
            const query = 'UPDATE doctor SET is_delete = ? WHERE doctorid = ?';
            const values = [value, doctorid];

            await queryAsync(query, values);
        } catch (error) {
            throw error;
        }
    },

};

module.exports = DoctorModel;
