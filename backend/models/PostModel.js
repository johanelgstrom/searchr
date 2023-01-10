const { model, Schema } = require("mongoose");

const postSchema = new Schema({
  creator: { type: String, required: true },
  title: { type: String, required: true },
  description: { type: String, required: true },
  category: { type: String, required: true },
  date: { type: String, required: true },
  imageUrl: { type: String, required: true },
  startingPoint: { type: Object, required: true },
  searches: { type: Array },
  found: { type: Boolean },
});

const PostModel = model("Posts", postSchema);

module.exports = PostModel;
