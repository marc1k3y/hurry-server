const mongoose = require('mongoose')
const Schema = mongoose.Schema

const BusSchema = new Schema({
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
  rate: {
    type: Number,
    default: 0
  },
  menu: {
    type: Array
  },
  connectId: {
    type: String
  },
  tgChatId: {
    type: Number
  },
  secretWord: {
    type: String
  }
})

const Bus = mongoose.model('bus', BusSchema)

module.exports = Bus