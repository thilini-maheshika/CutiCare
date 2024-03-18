const { connection } = require('../../../config/connection');
const util = require('util');
const queryAsync = util.promisify(connection.query).bind(connection);

const HospitalModel = {

    getAllHospital: async (offset, itemsPerPage) => {
        try {
            const query = `SELECT * FROM hospital WHERE is_delete = 0 LIMIT ? OFFSET ?`;
            const results = await queryAsync(query, [itemsPerPage, offset]);
            const totalItemsResults = await queryAsync("SELECT COUNT(*) as total FROM hospital WHERE is_delete = 0");
            const totalItems = totalItemsResults[0].total;

            return { results, totalItems };
        } catch (error) {
            throw error;
        }
    },

    getHospitalByName: async (hospital_name) => {
        try {
            const results = await queryAsync('SELECT * FROM hospital WHERE hospital_name = ? AND is_delete = 0', [hospital_name]);
            return results;
        } catch (error) {
            throw error;
        }
    },

    getHospitalById: async (hospitalid) => {
        try {
            const results = await queryAsync('SELECT * FROM hospital WHERE hospitalid = ? AND is_delete = 0', [hospitalid]);
            return results;
        } catch (error) {
            throw error;
        }
    },

    addHospital: async (hospital, filePath) => {
        try {
            const { hospital_name, location, phonenumber, email } = hospital;
            const trndate = new Date().toISOString().slice(0, 19).replace('T', ' ');
            const defaultValues = 0;
            const activeValues = 1;

            const query = 'INSERT INTO hospital (hospital_name, location, phonenumber, email, profileimage, trndate, hospital_status, is_delete) VALUES (?, ?, ?, ?, ?, ?, ?, ?)';
            const values = [hospital_name, location, phonenumber, email, filePath, trndate, activeValues, defaultValues];

            const results = await queryAsync(query, values);

            const hospital_id = results.insertId;
            return hospital_id;
        } catch (error) {
            throw error;
        }
    },

    updateHospital: async (hospital, hospitalid) => {
        try {
            const { hospital_name, location, phonenumber, status } = hospital;
            const query = 'UPDATE hospital SET hospital_name = ?, location = ?, phonenumber = ?, status = ? WHERE hospitalid = ?';
            const values = [hospital_name, location, phonenumber, status, hospitalid];

            await queryAsync(query, values);
        } catch (error) {
            throw error;
        }
    },

    deleteHospital: async (hospitalid, value) => {
        try {
            const query = 'UPDATE hospital SET is_delete = ? WHERE hospitalid = ?';
            const values = [value, hospitalid];

            await queryAsync(query, values);
        } catch (error) {
            throw error;
        }
    },

};

module.exports = HospitalModel;
