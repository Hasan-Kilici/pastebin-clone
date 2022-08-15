const mongoose = require("mongoose");
const Schema = mongoose.Schema;

let textSchema = new Schema({
  user: {
    type: String,
    require: true,
  },
  text: {
    type: String,
    require: true,
  },
  token: {
    type: String,
    require: true,
  },
  title: {
    type: String,
    require: true,
  },
  lang: {
    type: String,
    require: true,
  }
});

let text = mongoose.model("Text", textSchema);
module.exports = text;
