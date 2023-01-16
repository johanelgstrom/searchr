require("dotenv").config();
const express = require("express");
const postRouter = express.Router();
const jwt = require("jsonwebtoken");
const MongoDB = require("mongodb");
const utils = require("../utils.js");
const { getUniqueFilename } = require("../utils");
const userModel = require("../models/UserModel.js");
const postModel = require("../models/PostModel.js");

postRouter.post("/:id/check-author", async (req, res) => {
  const { userData } = req.body;
  const stringId = req.params.id;
  const isValid = MongoDB.ObjectId.isValid(stringId);
  const decodedData = jwt.decode(userData, process.env.JWTSECRET);
  const username = decodedData.username;

  if (isValid) {
    const objectId = MongoDB.ObjectId(stringId);
    userModel.findOne({ username }, async (err, user) => {
      postModel.findOne({ _id: objectId }, async (err, post) => {
        const userIdString = user._id.toString();
        if (userIdString === post.creator) {
          res.sendStatus(200);
        } else {
          res.sendStatus(404);
        }
      });
    });
  }
});

postRouter.get("/all-people", async (req, res) => {
  postModel.find({ category: "People" }, async (err, list) => {
    res.send(list);
  });
});
postRouter.get("/all-animals", async (req, res) => {
  postModel.find({ category: "Animal" }, async (err, list) => {
    res.send(list);
  });
});
postRouter.get("/all-objects", async (req, res) => {
  postModel.find({ category: "Object" }, async (err, list) => {
    res.send(list);
  });
});

postRouter.post("/create-post", async (req, res) => {
  const { userData, title, description, category, img, startingPoint } =
    req.body;
  const decodedData = jwt.decode(userData, process.env.JWTSECRET);
  let username = decodedData.username;
  userModel.findOne({ username }, async (err, user) => {
    const today = new Date();
    const yyyy = today.getFullYear();
    let mm = today.getMonth() + 1;
    let dd = today.getDate();

    if (dd < 10) dd = "0" + dd;
    if (mm < 10) mm = "0" + mm;

    const formattedToday = dd + "/" + mm + "/" + yyyy;
    const newPost = new postModel({
      creator: user._id,
      title,
      description,
      category,
      startingPoint,
      date: formattedToday,
      imageUrl: "/public/images/" + img,
      found: false,
    });
    await newPost.save();
    user.posts.push(newPost._id);
    await user.save();
    res.send(newPost._id);
  });
});

postRouter.post("/post-img", async (req, res) => {
  const image = req.files.image;
  const filename = getUniqueFilename(image.name);
  const uploadPath = process.cwd() + "/public/images/" + filename;
  await image.mv(uploadPath);
  res.send(filename);
});

postRouter.get("/:id", async (req, res) => {
  const stringId = req.params.id;
  const isValid = MongoDB.ObjectId.isValid(stringId);
  if (isValid) {
    const objectId = MongoDB.ObjectId(stringId);
    postModel.findOne({ _id: objectId }, async (err, post) => {
      if (post) {
        res.send(post);
      } else {
        res.sendStatus(404);
      }
    });
  }
});
postRouter.get("/img/:id", async (req, res) => {
  const stringId = req.params.id;
  const isValid = MongoDB.ObjectId.isValid(stringId);
  if (isValid) {
    const objectId = MongoDB.ObjectId(stringId);
    postModel.findOne({ _id: objectId }, async (err, post) => {
      if (post) {
        const image = process.cwd() + post.imageUrl;
        res.sendFile(image);
      } else {
        res.sendStatus(404);
      }
    });
  }
});
postRouter.post("/:id/post-search", async (req, res) => {
  const { userData, coordinates } = req.body;
  const stringId = req.params.id;
  const isValid = MongoDB.ObjectId.isValid(stringId);
  const decodedData = jwt.decode(userData, process.env.JWTSECRET);
  const username = decodedData.username;
  if (isValid) {
    const objectId = MongoDB.ObjectId(stringId);
    userModel.findOne({ username }, async (err, user) => {
      postModel.findOne({ _id: objectId }, async (err, post) => {
        const searchObj = {
          userId: user._id,
          coordinates: coordinates,
        };
        post.searches.push(searchObj);
        await post.save();
        res.sendStatus(200);
      });
    });
  } else {
    res.sendStatus(404);
  }
});
postRouter.post("/:id/change-active", async (req, res) => {
  const { userData } = req.body;
  const stringId = req.params.id;
  const isValid = MongoDB.ObjectId.isValid(stringId);
  const decodedData = jwt.decode(userData, process.env.JWTSECRET);
  const username = decodedData.username;

  if (isValid) {
    const objectId = MongoDB.ObjectId(stringId);
    userModel.findOne({ username }, async (err, user) => {
      postModel.findOne({ _id: objectId }, async (err, post) => {
        const userIdString = user._id.toString();
        if (userIdString === post.creator) {
          if (post.found === false) {
            post.found = true;
            await post.save();
            res.send(post);
          } else {
            post.found = false;
            await post.save();
            res.send(post);
          }
        } else {
          res.sendStatus(403);
        }
      });
    });
  }
});

postRouter.put("/:id/edit", async (req, res) => {
  const { userData, title, description, category } = req.body;
  const stringId = req.params.id;
  const isValid = MongoDB.ObjectId.isValid(stringId);
  const decodedData = jwt.decode(userData, process.env.JWTSECRET);
  const username = decodedData.username;
  if (isValid) {
    const objectId = MongoDB.ObjectId(stringId);
    userModel.findOne({ username }, async (err, user) => {
      postModel.findOne({ _id: objectId }, async (err, post) => {
        const userIdString = user._id.toString();
        if (userIdString === post.creator) {
          post.title = title;
          post.description = description;
          post.category = category;
          await post.save();
          res.sendStatus(200);
        } else {
          res.sendStatus(403);
        }
      });
    });
  }
});

postRouter.delete("/:id/delete", async (req, res) => {
  const { userData } = req.body;
  const stringId = req.params.id;
  const isValid = MongoDB.ObjectId.isValid(stringId);
  const decodedData = jwt.decode(userData, process.env.JWTSECRET);
  const username = decodedData.username;
  if (isValid) {
    const objectId = MongoDB.ObjectId(stringId);
    userModel.findOne({ username }, async (err, user) => {
      userModel.updateOne(
        { username },
        { $pull: { posts: objectId } },
        function (err) {
          console.log("post removed from user");
        }
      );
      postModel.findOneAndRemove({ _id: objectId }, async (err, post) => {
        if (post) {
          console.log("post removed");
        }
      });
      await user.save();
      res.sendStatus(200);
    });
  }
});

postRouter.post("/get-user-posts", async (req, res) => {
  const { userData } = req.body;
  const decodedData = jwt.decode(userData, process.env.JWTSECRET);
  const username = decodedData.username;
  if (decodedData) {
    userModel.findOne({ username }, async (err, user) => {
      if (user) {
        let postArray = [];
        for (let i = 0; i < user.posts.length; i++) {
          let id = user.posts[i];

          const post = await postModel.findOne({ _id: id });
          if (post) {
            postArray.push(post);
          }
        }
        res.send(postArray);
      } else {
        res.sendStatus(404);
      }
    });
  } else {
    res.sendStatus(201);
  }
});

module.exports = postRouter;
