require("dotenv").config();

const config = require("./config.js");
const mysql = require("mysql2/promise");

const tableInfo = [
  {
    tableName: "user",
    fields: [
      { name: 'userid', type: 'INT AUTO_INCREMENT PRIMARY KEY' },
      { name: 'fullname', type: 'VARCHAR(255)' },
      { name: 'phonenumber', type: 'VARCHAR(15)' },
      { name: 'address', type: 'VARCHAR(255)' },
      { name: 'email', type: 'VARCHAR(255)' },
      { name: 'gender', type: 'VARCHAR(10)' },
      { name: 'nic', type: 'VARCHAR(255)' },
      { name: 'username', type: 'VARCHAR(255)' },
      { name: 'password', type: 'VARCHAR(255)' },
      { name: 'trndate', type: 'DATETIME' },
      { name: 'is_delete', type: 'INT(5)' },
    ],
    insert: [
      {
        fullname: "admin",
        phonenumber: "+94771173022",
        address: "Galle, Sri Lanka",
        email: "admin@gmail.com",
        gender:"female",
        nic: "78655563565",
        username: "admin",
        password:
          "$2b$10$7PX0Yhnh05KJYRElnnbaruH1RsgsenTPDIDT7c3htrPBRx79.EeWe",
        trndate: new Date(),
        is_delete: 0,
      },
    ],
  },

  {
    tableName: "doctor",
    fields: [
      { name: 'doctorid', type: 'INT AUTO_INCREMENT PRIMARY KEY' },
      { name: "doctor_name", type: "VARCHAR(255)" },
      { name: "specialty", type: "VARCHAR(255)" },
      { name: "phonenumber", type: "VARCHAR(15)" },
      { name: "profileimage", type: "VARCHAR(255)" },
      { name: "doctor_status", type: "INT(5)" },
      { name: "trndate", type: "DATETIME" },
      { name: "is_delete", type: "INT(5)" },
    ],
  },
  
  {
    tableName: 'hospital',
    fields: [
      { name: 'hospitalId', type: 'INT AUTO_INCREMENT PRIMARY KEY' },
      { name: 'hospital_name', type: 'VARCHAR(255)' },
      { name: 'Location', type: 'VARCHAR(255)' },
      { name: 'phonenumber', type: 'VARCHAR(15)' },
      { name: 'email', type: 'VARCHAR(255)' },
      { name: 'hospital_status', type: 'INT(5)' },
      { name: 'trndate', type: 'DATETIME' },
      { name: 'is_delete', type: 'INT(5)' },
    ],
  },

  {
    tableName: 'doctor_assign',
    fields: [
      { name: 'assignid', type: 'INT AUTO_INCREMENT PRIMARY KEY' },
      { name: 'doctorid' , type: 'INT(5)'},
      { name: 'hospitalId' , type: 'INT(5)'},
      { name: 'assign_status', type: 'INT(5)' },
      { name: 'trndate', type: 'DATETIME' },
    ],
  },
  
];

// Function to check and set up the tables
async function checkTables() {
  try {
    const pool = await mysql.createPool(config.connection);
    const connection = await pool.getConnection();

    const existingTables = await getExistingTables(connection);
    await createNewTables(connection, existingTables);
    await removeUnusedTables(connection, existingTables);

    connection.release();
    pool.end();
  } catch (err) {
    console.error(err);
  }
}

// Function to get existing table names from the database
async function getExistingTables(connection) {
  const [rows] = await connection.query(
    `SELECT TABLE_NAME FROM INFORMATION_SCHEMA.TABLES WHERE TABLE_SCHEMA = '${config.connection.database}'`
  );
  return rows.map((row) => row.TABLE_NAME);
}

// Function to create new tables and add indexes if needed
async function createNewTables(connection, existingTables) {
  for (const table of tableInfo) {
    if (!existingTables.includes(table.tableName)) {
      const fieldsString = table.fields
        .map((field) => `${field.name} ${field.type}`)
        .join(", ");

      // Create the table with the defined fields
      const createQuery = `CREATE TABLE ${table.tableName} (${fieldsString})`;
      await connection.query(createQuery);
      console.log(`Table '${table.tableName}' created!`);

      // Add indexes after creating the table
      if (table.indexes) {
        for (const index of table.indexes) {
          const indexQuery = `ALTER TABLE ${table.tableName} ADD INDEX ${
            index.name
          } (${index.columns.join(", ")})`;
          await connection.query(indexQuery);
          console.log(
            `Index '${index.name}' added to table '${table.tableName}'`
          );
        }
      }

      if (table.insert && table.insert.length > 0) {
        for (const item of table.insert) {
          const insertData = { ...item }; // Spread the data to avoid modifying the original object
          const insertQuery = `INSERT INTO ${table.tableName} SET ?`;
          await connection.query(insertQuery, insertData);
          console.log(`Data inserted into table '${table.tableName}'`);
        }
      }
    } else {
      await checkAndAlterFields(connection, table);
    }
  }
}

// Function to check and alter fields in existing tables if needed
async function checkAndAlterFields(connection, table) {
  const [columns] = await connection.query(
    `SHOW COLUMNS FROM ${table.tableName}`
  );
  const existingFields = columns.map((column) => column.Field);
  const fieldsToAdd = table.fields.filter(
    (field) => !existingFields.includes(field.name)
  );
  const fieldsToRemove = existingFields.filter(
    (field) => !table.fields.some((f) => f.name === field)
  );

  if (fieldsToAdd.length > 0) {
    await addFieldsToTable(connection, table.tableName, fieldsToAdd);
  }

  if (fieldsToRemove.length > 0) {
    await removeFieldsFromTable(connection, table.tableName, fieldsToRemove);
  }
}

// Function to add new fields to an existing table
async function addFieldsToTable(connection, tableName, fieldsToAdd) {
  for (const field of fieldsToAdd) {
    const addQuery = `ALTER TABLE ${tableName} ADD COLUMN ${field.name} ${field.type}`;
    await connection.query(addQuery);
    console.log(`Field '${field.name}' added to table '${tableName}'`);
  }
}

// Function to remove fields from an existing table
async function removeFieldsFromTable(connection, tableName, fieldsToRemove) {
  for (const field of fieldsToRemove) {
    const removeQuery = `ALTER TABLE ${tableName} DROP COLUMN ${field}`;
    await connection.query(removeQuery);
    console.log(`Field '${field}' removed from table '${tableName}'`);
  }
}

// Uncomment and use this function to remove unused tables

async function removeUnusedTables(connection, existingTables) {
  for (const existingTable of existingTables) {
    const tableExists = tableInfo.some(
      (table) => table.tableName === existingTable
    );
    if (!tableExists) {
      const removeQuery = `DROP TABLE ${existingTable}`;
      await connection.query(removeQuery);
      console.log(`Table '${existingTable}' removed`);
    }
  }
}

// Export the necessary functions and tableInfo
module.exports = { checkTables, tableInfo };
