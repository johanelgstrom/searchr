require("dotenv").config();
require("./mongoose.js");

//REQUIREMENTS
const express = require("express");
const cors = require("cors");
const multer = require("multer");
const fileUpload = require("express-fileupload");
const bodyParser = require("body-parser");
const UserModel = require("./models/UserModel.js");
const PostModel = require("./models/PostModel.js");

//ROUTER REQUIREMENTS
const loginRouter = require("./routes/loginRouter.js");
const postRouter = require("./routes/postRouter.js");
//SETUP
const app = express();
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(express.static("public"));
app.set("view engine", "html");
app.use(cors());
app.use(
  bodyParser.urlencoded({
    extended: false,
  })
);
app.use(fileUpload());

//ROUTES
app.use("/login", loginRouter);
app.use("/post", postRouter);

//LOCAL SERVER
app.listen(8000, () => {
  console.log("Server is running at http://localhost:8000");
});
