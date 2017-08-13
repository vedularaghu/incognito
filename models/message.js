var mongoose = require('mongoose');
var schema = mongoose.schema;
var messageschema = new schema({
  username: String,
  msg: String
},{collections: 'message', minimize: false});

var message = mongoose.model('message',messageschema)
