//SETUP sqlite
const sqlite = require("sqlite3");

const db = new sqlite.Database("database.db");

/* ------------------------------ accounts ------------------------------------ */

//create db-table if it doesnt exist
db.run(`
    Create Table if not Exists accounts (
        id Integer Primary Key,
        username Text,
        hashedPassword Text,
        name Text,
        motto Text,
        Constraint uniqueUsername Unique(username)
    )
`);

//save user in db
module.exports.registerUser = (
  username,
  hashedPassword,
  name,
  motto,
  callback
) => {
  const query = `
        Insert into accounts 
            (username, hashedPassword, name, motto)
        Values
            (?, ?, ?, ?)
    `;

  const values = [username, hashedPassword, name, motto];

  db.run(query, values, callback);
};

//GET one user from DB
exports.getAccountByUsername = function (username, callback) {
  const query = `
        select * from accounts where username = ?
    `;
  const values = [username];

  db.get(query, values, callback);
};

// GET all users from DB
exports.getAllAccounts = function (callback) {
  const query = `
      Select * from accounts
    `;
  db.all(query, callback);
};

/* -----------------------CARS----------------------------*/

//create new table for cars if it doesnt exist
db.run(`
      Create Table if Not Exists cars (
        id Integer Primary Key,
        make Text,
        model Text
      )
`);

//save car in db
module.exports.registerCar = (make, model, callback) => {
  const query = `
    Insert Into cars
      (make, model)
    Values
      (?, ?)
  `;

  const values = [make, model];

  db.run(query, values, callback);
};

//get a car from db
exports.getCarById = function (id, callback) {
  const query = `
    Select * from cars where id = ?
  `;
  const values = [id];

  db.get(query, values, callback);
};

//get a list of all cars
exports.getAllCars = function (callback) {
  const query = `
    Select * from cars
  `;

  db.all(query, callback); //all instead of get to see the entire array
};
