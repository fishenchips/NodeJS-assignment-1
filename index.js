//setup
const express = require("express");

const db = reqiure("./db.js");

const utils = require("./utils.js");

const app = express();

//use this to be able to recieve a body in json format
app.use(express.json());

//app.use get user from token if logged in ---> for the entire webpage
app.use((req, res, next) => {
  const token = req.headers.authorization; // where we enter authorization = token (hashedPassword) in headers of Postman

  //if user has correct authorization token and user is verified by jwt
  // doesnt matter if we are logged in or not, just checks and the goes to next
  // checks if there is something to verify && that its the right user
  if (token && utils.verifyJWT(token)) {
    //what is sent back to the user
    const tokenData = utils.decodeJWT(token);

    req.user = tokenData;
    req.user.isLoggedIn = true;
  } else {
    req.user = { isLoggedIn: false };
  }

  //always go to the next function, no matter if user is loggedIn or not
  next();
});

// Force login middleware will be used for crud requests
const forceAuthorization = (req, res, next) => {
  if (req.user.isLoggedIn) {
    //if the user is logged in move to the next function (using forceAuthorization)
    next();
  } else {
    res.sendStatus(401);
  }
};

//GET the start page
app.get("/", (req, res) => {
  res.send(req.user); //either loged in or not
});

/*  ------------------- USERS -------------------------------*/
//CREATE new user
app.post("/register", (req, res) => {
  const { username, password, name, motto } = req.body;

  //take hashed password from hashPassword function
  const hashedPassword = utils.hashPassword(password);

  db.registerUser(
    username,
    hashedPassword,
    name,
    motto,
    /*       callback starts here!*/
    (error) => {
      if (error) {
        console.log(error);
        res.status(500).send(error);
      } else {
        res.sendStatus(200);
      }
    }
  ); //callback ends here
});

app.listen(8000, () => {
  "http://localhost:8000/";
});
