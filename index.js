//setup
const express = require("express");

const db = require("./db.js");

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

//LOGIN user
app.post("/login", (req, res) => {
  const { username, password } = req.body;

  db.getAccountByUsername(username, (error, account) => {
    if (error) {
      res.status(500).send(error);
    } else if (account) {
      const hashedPassword = account.hashedPassword;
      const correctPassword = utils.comparePassword(password, hashedPassword);

      if (correctPassword) {
        const jwtToken = utils.getJWTToken(account);
        res.send(jwtToken);
      } else {
        res.sendStatus(404);
      }
    } else {
      res.sendStatus(404);
    }
  });
});

//only users that are logged on can see accounts
app.get("/accounts", forceAuthorization, (req, res) => {
  // db functions takes 2 arguments, first is the potential error and the 2nd is what we want to get
  db.getAllAccounts((error, users) => {
    if (error) {
      res.status.send(500).send(error);
    } else {
      res.send(users);
    }
  });
});

/* ------------------------- C A R S -----------------------------------  */

//get list of all cars
app.get("/cars", forceAuthorization, (req, res) => {
  db.getAllCars((error, cars) => {
    if (error) {
      res.status(500).send(error);
    } else {
      res.send(cars);
    }
  });
});

//get car by ID
app.get("/cars/:id", forceAuthorization, (req, res) => {
  const id = parseInt(req.params.id);
  db.getCarById(id, (error, car) => {
    if (error) {
      res.status(500).send(error);
    } else {
      res.send(car);
    }
  });
});

//POST a new car
app.post("/cars", forceAuthorization, (req, res) => {
  const newCar = {
    make: req.body.make,
    model: req.body.model,
  };

  //this takes THREE arguments, make, model and callback! See in db.js
  db.registerCar(newCar.make, newCar.model, (error) => {
    if (error) {
      console.log(error);
      res.status(500).send(error);
    } else {
      res.sendStatus(200);
    }
  });
});

app.listen(8000, () => {
  "http://localhost:8000/";
});
