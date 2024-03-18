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

    getHospitalById: async (hospital_id) => {
        try {
            const results = await queryAsync('SELECT * FROM hospital WHERE hospital_id = ? AND is_delete = 0', [hospital_id]);
            return results;
        } catch (error) {
            throw error;
        }
    },

    addHospital: async (hospital, filePath) => {
        try {
            const { hospital_name, location, phonenumber } = hospital;
            const trndate = new Date().toISOString().slice(0, 19).replace('T', ' ');
            const defaultValues = 0;
            const activeValues = 1;

            const query = 'INSERT INTO hospital (hospital_name, location, phonenumber, profileimage, trndate, status, is_delete) VALUES (?, ?, ?, ?, ?, ?, ?)';
            const values = [hospital_name, location, phonenumber, filePath, trndate, activeValues, defaultValues];

            const results = await queryAsync(query, values);

            const hospital_id = results.insertId;
            return hospital_id;
        } catch (error) {
            throw error;
        }
    },

    updateHospital: async (hospital, hospital_id) => {
        try {
            const { hospital_name, location, phonenumber, status } = hospital;
            const query = 'UPDATE hospital SET hospital_name = ?, location = ?, phonenumber = ?, status = ? WHERE hospital_id = ?';
            const values = [hospital_name, location, phonenumber, status, hospital_id];

            await queryAsync(query, values);
        } catch (error) {
            throw error;
        }
    },

    deleteHospital: async (hospital_id, value) => {
        try {
            const query = 'UPDATE hospital SET is_delete = ? WHERE hospital_id = ?';
            const values = [value, hospital_id];

            await queryAsync(query, values);
        } catch (error) {
            throw error;
        }
    },

};

module.exports = HospitalModel;
