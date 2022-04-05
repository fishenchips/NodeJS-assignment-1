//setup
const express = require("express");

const db = reqiure("./db.js");

const utils = require("./utils.js");

const app = express();

app.use(express.json());

app.listen(8000, () => {
  "http://localhost:8000/";
});
