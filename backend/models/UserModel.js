const { model, Schema } = require("mongoose");

const userSchema = new Schema({
  name: { type: String, required: true },
  username: { type: String, required: true },
  email: { type: String, required: true },
  hashedPassword: { type: String, required: true },
  posts: { type: Array },
});

const UserModel = model("Users", userSchema);

module.exports = UserModel;
