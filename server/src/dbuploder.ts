import { KeyObject } from "crypto";
import { Client, QueryResult } from "pg";
import * as dbUtil from "./utils/dbUtil";
console.log(" dbupload");
const fs = require("fs");
const csv = require("csv-parser");

const readCsvFile = async (filePath: string, tableName: string) => {
  try {
    const csvData = [];
    fs.createReadStream(filePath)
      .pipe(csv({}))
      .on("data", (data: any) => csvData
      .push(data))
      .on("end", () => {
        //console.log(csvArray);
        //console.log(Object.values(csvData[0]));
        //console.log(Object.keys(csvData[0]));
        //const dataToInsernt = Object.values(csvData[0]);
        for (let row in csvData) {
          const sql = `INSERT INTO ${tableName}(id, number, name) VALUES($1, $2, $3)`;
          const result = dbUtil.sqlToDB(sql, Object.values(csvData[row]));
        }
        
        //const sql = `INSERT INTO ${tableName}(id, number, name) VALUES($1, $2, $3)`;
        //const result = dbUtil.sqlToDB(sql, Object.values(csvData[0]));
      });

      
  } catch (error) {
    throw new Error(error.message);
  }
};

const readSqlFile = async (filePath: string) => {
  try {
    const read = fs.readFileSync(filePath, "utf-8");
    //console.log(read);
    const result = await dbUtil.sqlToDB(read, []);
  } catch (error) {
    throw new Error(error.message);
  }
};

const createTable2 = async (Tablename: string) => {
  const sql = `INSERT INTO caregiver2(id, number, name) VALUES($1, $2, $3)`;
  const data = ['1', '2' ,'3'];
  try {
    const result = await dbUtil.sqlToDB(sql, data);
  } catch (error) {
    throw new Error(error.message);
  }
};

const createTable = async (Tablename: string) => {
  const sql = `
  CREATE TABLE ${Tablename} (
      id SERIAL PRIMARY KEY,
      number INT,
	    name TEXT
  )
  `;
  try {
    const result = await dbUtil.sqlToDB(sql, []);
  } catch (error) {
    throw new Error(error.message);
  }
};

const DeleteTable = async (Tablename: string) => {
  const sql = `
  DROP TABLE IF EXISTS ${Tablename}
   `;
  try {
    const result = await dbUtil.sqlToDB(sql, []);
  } catch (error) {
    throw new Error(error.message);
  }
};

module.exports = { readSqlFile, createTable, DeleteTable, readCsvFile, createTable2 };
