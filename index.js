const express = require('express')
const cors = require('cors')
const mongoose = require('mongoose')
const shelude = require("node-schedule")

mongoose.connect('mongodb+srv://marc1k3y:r4k4m4k4f0@hurryapp.5lsa5.mongodb.net/HurryApp')
mongoose.Promise = global.Promise

const app = express()

const userRouter = require('./routes/userApi')
const busRouter = require('./routes/busApi')
const User = require('./models/user')

app.use(express.json())
app.use(cors())
app.use('/api/user', userRouter)
app.use('/api/bus', busRouter)
app.use((err, req, res, next) => {
  err && res.status(422).send({ error: err.message })
})

shelude.scheduleJob('20 4 * * *', () => {
  User.updateMany({}, { $set: { votes: 2 } })
    .then((res) => console.log(res))
    .catch((err) => console.log(err))
})

app.listen(process.env.port || 4000, function () {
  console.log('Server started')
})