require("dotenv").config();
const express = require("express");
const loginRouter = express.Router();
const jwt = require("jsonwebtoken");
const utils = require("../utils.js");
const userModel = require("../models/UserModel.js");

const forceAuthorize = (req, res, next) => {
  const { username, name, userData } = req.body;

  if (
    (userData && jwt.verify(userData, process.env.JWTSECRET)) ||
    (username && name && email)
  ) {
    next();
  } else {
    res.sendStatus(401).render("unauthorized");
  }
};

const ifLoggedIn = async (req, res, next) => {
  const { username, name, userData } = req.body;
  if (
    (userData && jwt.verify(userData, process.env.JWTSECRET)) ||
    (username && name && email)
  ) {
    res.sendStatus(200);
  } else {
    res.sendStatus(401).render("unauthorized");
  }
};

loginRouter.get("/", ifLoggedIn, (res, req) => {
  res.sendStatus(200);
});
// REGISTER
loginRouter.post("/register", async (req, res) => {
  const { name, username, email, password, confirmPassword } = req.body;

  // Kolla om man kan skapa en användare med samma användarnamn om man använder ett nytt fullName
  userModel.findOne({ $or: [{ username }, { email }] }, async (err, user) => {
    if (user) {
      res.send("Username or email already exists");
    } else if (password !== confirmPassword) {
      res.send("Password don't match");
    } else {
      const newUser = new userModel({
        name,
        username,
        email,
        hashedPassword: utils.hashedPassword(password),
      });
      const userData = {
        username: username,
        name: name,
        email: email,
      };
      await newUser.save();
      const accessToken = jwt.sign(userData, process.env.JWTSECRET);
      res.send(accessToken);
    }
  });
});

loginRouter.post("/login", async (req, res) => {
  const { username, password } = req.body;
  userModel.findOne({ username }, async (err, user) => {
    if (user) {
      const checkPassword = utils.comparePassword(
        password,
        user.hashedPassword
      );
      if (checkPassword === true) {
        const userData = {
          username: user.username,
          name: user.name,
          email: user.email,
        };
        const accessToken = jwt.sign(userData, process.env.JWTSECRET);
        res.send(accessToken);
      } else {
        res.send("wrong password");
      }
    } else {
      res.send("wrong username");
    }
  });
});

loginRouter.post("/ifLoggedIn", async (req, res) => {
  const { userData } = req.body;
  if (userData) {
    if (jwt.verify(userData, process.env.JWTSECRET)) {
      res.sendStatus(200);
    } else {
      res.sendStatus(404);
    }
  } else {
    res.sendStatus(401);
  }
});

loginRouter.post("/user-data", async (req, res) => {
  const { userData } = req.body;
  const decodedData = jwt.decode(userData, process.env.JWTSECRET);
  if (decodedData) {
    res.send(decodedData);
  } else {
    res.sendStatus(201);
  }
});

module.exports = loginRouter;
