const express = require("express");
const { ObjectId } = require("mongodb");
const db = require("../data/database");

const router = express.Router();

router.get("/", (req, res) => {
  res.redirect("posts");
});

router.get("/posts", async (req, res) => {
  const options = {
    projection: { _id: 1, title: 1, summary: 1, "author.name": 1 },
  };

  const posts = await db
    .getDb()
    .collection("posts")
    .find({}, options)
    .toArray();
  // console.log(posts);
  res.render("posts-list", { posts });
});

router.get("/new-post", async (req, res) => {
  let options = {
    projection: { _id: 1, name: 1 },
  };

  const authors = await db
    .getDb()
    .collection("authors")
    .find({}, options)
    .toArray();
  // console.log(authors);
  res.render("create-post", { authors });
});

router.post("/new-post", async (req, res) => {
  // find author by id
  const authorId = req.body.author;
  const author = await db
    .getDb()
    .collection("authors")
    .findOne({ _id: new ObjectId(authorId) }, { _id: 1, name: 1 });

  const newPost = {
    ...req.body,
  };

  newPost.date = new Date().toISOString();
  newPost.author = {
    id: authorId,
    name: author.name,
  };

  await db.getDb().collection("posts").insertOne(newPost);
  res.redirect("/posts");
});

router.get("/post/:id", async (req, res, next) => {
  let postId = req.params.id;
  try {
    postId = new ObjectId(req.params.id);
  } catch (error) {
    return res.status(404).render("404");
    // return next(error);
  }
  const post = await db
    .getDb()
    .collection("posts")
    .findOne({ _id: postId }, { summary: 0 });

  const author = await db
    .getDb()
    .collection("authors")
    .findOne({ _id: new ObjectId(post.author.id) }, { phone: 0 });

  console.log(author);
  // post.date = post.date.toISOString();
  /* post.humanReadableDate = post.date.toLocaleDateString("en-US", {
    weekday: "long",
    year: "numeric",
    month: "long",
    day: "numeric",
  }); */

  res.render("post-detail", { post, author });
});

router.get("/post/:id/edit", async (req, res) => {
  let postId = req.params.id;
  try {
    postId = new ObjectId(req.params.id);
  } catch (error) {
    return res.status(404).render("404");
    // return next(error);
  }
  const post = await db
    .getDb()
    .collection("posts")
    .findOne({ _id: postId }, { author: 0 });
  res.render("update-post", { post });
});

router.post("/post/:id/edit", async (req, res) => {
  const postId = new ObjectId(req.params.id);
  await db
    .getDb()
    .collection("posts")
    .updateOne({ _id: postId }, { $set: { ...req.body } });
  res.redirect("/posts");
});

router.post("/post/:id/delete", async (req, res) => {
  const postId = new ObjectId(req.params.id);
  await db.getDb().collection("posts").deleteOne({ _id: postId });
  res.redirect("/posts");
});

module.exports = router;
