const { Pool } = require("pg");

const pool = new Pool({
  host: process.env.PG_HOST,
  user: process.env.PG_USER,
  password: process.env.PG_PASSWORD,
  database: process.env.PG_DATABASE,
  port: process.env.PG_PORT,
  max: 10,
  ssl: false,
});

pool.query = (sql, values) => {
  return new Promise((resolve, reject) => {
    pool.connect((err, client, release) => {
      if (err) {
        return reject(err);
      }
      client.query(sql, values, (err, results) => {
        release();
        if (err) {
          return reject(err);
        }
        resolve(results);
      });
    });
  });
};

const createError = require("../utils/create-error");

const makeUsersDb = require("./user");
const makeRolesDb = require("./role");
const makeFoldersDb = require("./folder");
const makeFilesDb = require("./file");
const makeOrganizationsDb = require("./organization");

const usersDb = makeUsersDb({ pool, createError });
const rolesDb = makeRolesDb({ pool, createError });
const foldersDb = makeFoldersDb({ pool, createError });
const filesDb = makeFilesDb({ pool, createError });
const organizationsDb = makeOrganizationsDb({ pool, createError });

module.exports = Object.freeze({
  usersDb,
  rolesDb,
  filesDb,
  foldersDb,
  organizationsDb,
});
