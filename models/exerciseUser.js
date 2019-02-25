const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const userSchema = new Schema({
  "_id": String, //Defining _id in the schema so not ObjectId like Mongoose expects
  "username": String,
  "count": {type:Number, default:0},
  "log":Array
},{timestamp:true});
//SchemaOptions - when item is created, timestamp to know when it was created

//mongoose.model(collection, Schema)
const exerciseUser = mongoose.model('exerciseUser', userSchema);

module.exports = exerciseUser;
