var mongoose = require('mongoose');
var schema = mongoose.Schema;
var userschema = new schema({
  name: String,
  username: String,
  password: String,
  msg: [{ body: String, date: Date }],
  date: { type: Date, default: Date.now }
},{collection: 'users' , minimize: false});

var users = mongoose.model('users',userschema);

module.exports = users;
