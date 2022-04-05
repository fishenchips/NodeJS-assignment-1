//setup for utils.js
//to hash passwords
const bcrypt = require("bcrypt");

const jwt = require("jsonwebtoken");

// will use this key to verify that changes are done by someone we trust
// obviously not pushing this up in real apps.. :)
const JWT_SECRET = "notsecret";

// function that hashes the password - that will be saved in the DB
module.exports.hashPassword = (password) => {
  const hashValue = bcrypt.hashSync(password, 8); //8 is difficulty settings - to high number makes the server slow

  return hashValue;
};

//compare hashed password from db with password from the request
module.exports.comparePassword = (password, hash) => {
  const correct = bcrypt.compareSync(password, hash); //value will be true/false

  return correct;
};
