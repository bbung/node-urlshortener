const express = require("express");
const mongoose = require("mongoose");
const Joi = require("joi");
var app = express();

const port = process.env.PORT || 3000;

const mongo_connection_string = process.env.MONGO_DB || "mongodb://localhost/urlshortener"

mongoose
  .connect(
    mongo_connection_string,
    { useNewUrlParser: true }
  )
  .then(() => console.log("Connected to MongoDb"))
  .catch(err => console.error("could not connect to mongo db", err));

const ShortenedURL = mongoose.model(
  "shortenURL",
  new mongoose.Schema({
    target: String,
    shortcut: String,
    access: [Date],
    counter: Number
  })
);

app.use(express.json());
app.get("/", async (req, res) => {
  res.send(await ShortenedURL.find().sort("shortcut"));
});

app.get("/:shortcut", async (req, res) => {
  const result = await ShortenedURL.find({
    shortcut: req.params.shortcut
  }).limit(1);
  if (!result || result.length <= 0) return res.sendStatus(204);

  return res.redirect(result[0].target);
});

const shortened = Joi.object().keys({
  target: Joi.string()
    .uri({
      scheme: ["http", "https"]
    })
    .required(),
  shortcut: Joi.string().required()
});

// create new entry
app.post("/shorten", async (req, res) => {
  const validationResult = Joi.validate(req.body, shortened);

  if (validationResult.error) {
    res.send(validationResult.error);
    return;
  }

  console.log(req.body);
  //check if exists
  const existingURL = await ShortenedURL.find({shortcut: req.body.shortcut});

  if (existingURL && existingURL.length >= 1) {
    res.send(`Entry "${req.body.shortcut}" already exists and is pointing to ${existingURL[0].target}`);
    return;
  } else {
    const newShortcut = new ShortenedURL(req.body);
    const result = await newShortcut.save();
    res.send(result);
  }
  console.log(result);
});

app.listen(port, () => {
  console.log(`Server is up on port ${port}`);
});
