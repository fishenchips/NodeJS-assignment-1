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
//using hashSync & compareSync because its easier for now (instead of asyncronous)

//create and sign json webtoken ------------ jwt = string with loads of symbols.
// this is readable, so dont place any sensitive info in this function
module.exports.getJWTToken = (account) => {
  const userData = { userId: account.id, username: account.username };
  const accessToken = jwt.sign(userData, JWT_SECRET);

  return accessToken; // send back to the user to they can prove that they are they
};

//verify signature of json webtoken
module.exports.verifyJWT = (token) => {
  return jwt.verify(token, JWT_SECRET);
}; //is the token signed by us?

//GET data from json web token
module.exports.decodeJWT = (token) => {
  return jwt.decode(token, JWT_SECRET);
};
