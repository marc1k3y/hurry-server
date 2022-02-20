const mongoose = require('mongoose')
const Schema = mongoose.Schema

const UserSchema = new Schema({
  login: {
    type: String,
    required: true
  },
  password: {
    type: String,
    required: true
  },
  info: {
    type: Object
  },
  votes: {
    type: Number,
    default: 2
  },
  cart: {
    type: Array
  },
  tgChatId: {
    type: Number
  },
  connectId: {
    type: String
  }
})

const User = mongoose.model('user', UserSchema)

module.exports = User