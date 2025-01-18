// Blog Model (MongoDB Schema)
const mongoose = require('mongoose');

const blogSchema = new mongoose.Schema({
  title: { type: String, required: true },
  date: { type: Date, default: Date.now },
  author: { type: String, required: true },
  images: [{ type: String }], // URL or file path to image
  description: { type: String, required: true },
  cityDetails: [{
    cityName: { type: String, required: true }, 
    description: { type: String, required: true },
    link:{type:String,required:true}
  }]
});

const Blog = mongoose.model('Blog', blogSchema);
module.exports = Blog;
