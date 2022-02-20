const express = require('express')
const router = express.Router()
const passGen = require('generate-password')
const User = require('../models/user')
const { hasher, uncrypt } = require('../utils/hasher')
const { sendOrder, forgotPass, changePass } = require('../bot')
const Bus = require('../models/bus')

router.post('/reg', async (req, res) => {
  const { login, password } = req.body
  const hpass = await hasher(password)
  User.findOne({ login })
    .then((user) => {
      user
        ? res.sendStatus(300)
        : User.create({ login, password: hpass })
          .then((user) => {
            res.send(user._id)
          })
          .catch((e) => res.send(e))
    })
    .catch(() => {
      res.sendStatus(404)
    })
})

router.post('/login', (req, res) => {
  const { login, password } = req.body
  User.findOne({ login })
    .then((user) => {
      uncrypt(user.password, password)
        .then((result) => result
          ? res.send(user._id)
          : res.sendStatus(300))
    })
    .catch(() => {
      res.sendStatus(404)
    })
})

router.get('/check', (req, res) => {
  const { uid } = req.query
  User.findOne({ _id: uid })
    .then((result) => result ? res.sendStatus(200) : res.sendStatus(300))
    .catch(() => res.sendStatus(404))
})

router.put('/connect', (req, res) => {
  const { uid } = req.query
  const { connId } = req.body
  User.findOne({ _id: uid })
    .then((user) => {
      user.connectId = connId
      user.save()
      res.sendStatus(200)
    })
    .catch(() => res.sendStatus(404))
})

router.put('/forgotPass', (req, res) => {
  const { login } = req.body
  User.findOne({ login })
    .then(async (user) => {
      const { tgChatId } = user
      if (tgChatId) {
        const newPass = passGen.generate({
          length: 8,
          numbers: true
        })
        const hpass = await hasher(newPass)
        user.password = hpass
        user.save()
        forgotPass(tgChatId, newPass)
        res.sendStatus(200)
      } else {
        res.sendStatus(300)
      }
    })
    .catch(() => res.sendStatus(404))
})

router.put(`/changePass`, (req, res) => {
  const { uid, newPass } = req.body
  changePass('guest', uid, newPass)
    .then(() => res.sendStatus(200))
    .catch(() => res.sendStatus(300))
})

router.put('/cart', (req, res) => {
  const { bid } = req.query
  User.findOne({ _id: req.query.uid })
    .then((user) => {
      user.cart.push({ [bid]: req.body })
      user.save()
      res.send({ message: "basket updated" })
    })
    .catch(() => {
      res.sendStatus(404)
    })
})

router.delete('/cart', (req, res) => {
  User.findOne({ _id: req.query.uid })
    .then((user) => {
      user.cart = []
      user.save()
      res.sendStatus(200)
    })
})

router.get('/cart', (req, res) => {
  User.findOne({ _id: req.query.uid })
    .then((user) => {
      res.send(user.cart)
    })
    .catch(() => {
      res.sendStatus(404)
    })
})

router.put('/info', (req, res) => {
  User.findOne({ _id: req.query.uid })
    .then((user) => {
      const { info } = req.body
      user.info = info
      user.save()
      res.sendStatus(200)
    })
    .catch(() => res.sendStatus(404))
})

router.get('/checkInfo', (req, res) => {
  User.findOne({ _id: req.query.uid })
    .then((user) => {
      const { nickname, country, city } = user.info
      nickname && country && city
        ? res.sendStatus(200)
        : res.sendStatus(300)
    })
    .catch(() => res.sendStatus(404))
})

router.get('/info', (req, res) => {
  User.findOne({ _id: req.query.uid })
    .then((user) => {
      const { info, tgChatId } = user
      res.send({ info, tgChatId })
    })
    .catch(() => res.sendStatus(404))
})

router.get('/city', (req, res) => {
  User.findOne({ _id: req.query.uid })
    .then((user) => {
      const { city } = user.info
      res.send(city)
    })
    .catch(() => res.sendStatus(404))
})

router.post('/sendOrder', (req, res) => {
  const { chatId, order, pTime, bid, sum, sw } = req.body
  Bus.findOne({ _id: bid })
    .then((bus) => {
      sw.toLowerCase() === bus.info.secretWord.toLowerCase()
        ? User.findOne({ _id: req.query.uid })
          .then((user) => {
            if (!user.info?.nickname) return res.sendStatus(301)
            sendOrder(chatId, user.info.nickname, order, pTime, bid, sum)
            user.cart = []
            user.save()
            res.sendStatus(200)
          })
        : res.sendStatus(300)
    })
    .catch(() => res.sendStatus(404))
})

router.put('/rateUp', (req, res) => {
  const { uid, bid } = req.body
  User.findOne({ _id: uid })
    .then((user) => {
      user.votes--
      user.markModified('votes')
      user.save()
      Bus.findOne({ _id: bid })
        .then((bus) => {
          bus.rate++
          bus.markModified('rate')
          bus.save()
          res.sendStatus(200)
        })
    })
    .catch(() => res.sendStatus(404))
})

router.put('/rateDown', (req, res) => {
  const { uid, bid } = req.body
  User.findOne({ _id: uid })
    .then((user) => {
      user.votes--
      user.markModified('votes')
      user.save()
      Bus.findOne({ _id: bid })
        .then((bus) => {
          bus.rate--
          bus.markModified('rate')
          bus.save()
          res.sendStatus(200)
        })
    })
    .catch(() => res.sendStatus(404))
})

router.get('/votes', (req, res) => {
  User.findOne({ _id: req.query.uid })
    .then((user) => {
      res.json(user.votes)
    })
    .catch(() => res.sendStatus(404))
})

module.exports = router