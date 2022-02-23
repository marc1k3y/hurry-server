const express = require('express')
const { forgotPass, changePass } = require('../bot')
const passGen = require('generate-password')
const router = express.Router()
const Bus = require('../models/bus')
const { hasher, uncrypt } = require('../utils/hasher')

router.post('/reg', async (req, res) => {
  const { login, password } = req.body
  const hpass = await hasher(password)
  Bus.findOne({ login })
    .then((bus) => {
      bus
        ? res.sendStatus(300)
        : Bus.create({ login, password: hpass })
          .then((bus) => {
            res.send(bus._id)
          })
          .catch((e) => res.send(e))
    })
    .catch(() => {
      res.sendStatus(500)
    })
})

router.post('/login', (req, res) => {
  const { login, password } = req.body
  Bus.findOne({ login })
    .then((bus) => {
      uncrypt(bus.password, password)
        .then((result) => result
          ? res.send(bus._id)
          : res.sendStatus(300))
    })
    .catch(() => {
      res.sendStatus(404)
    })
})

router.get('/check', (req, res) => {
  const { bid } = req.query
  Bus.findOne({ _id: bid })
    .then((result) => result ? res.sendStatus(200) : res.sendStatus(300))
    .catch(() => res.sendStatus(404))
})

router.put('/connect', (req, res) => {
  const { bid } = req.query
  const { connId } = req.body
  Bus.findOne({ _id: bid })
    .then((bus) => {
      bus.connectId = connId
      bus.save()
      res.sendStatus(200)
    })
    .catch(() => res.sendStatus(404))
})

router.put('/forgotPass', (req, res) => {
  const { login } = req.body
  Bus.findOne({ login })
    .then(async (bus) => {
      const { tgChatId } = bus
      if (tgChatId) {
        const newPass = passGen.generate({
          length: 8,
          numbers: true
        })
        const hpass = await hasher(newPass)
        bus.password = hpass
        bus.save()
        forgotPass(tgChatId, newPass)
        res.sendStatus(200)
      } else {
        res.sendStatus(300)
      }
    })
    .catch(() => res.sendStatus(404))
})

router.put(`/changePass`, (req, res) => {
  const { bid, newPass } = req.body
  changePass('bus', bid, newPass)
    .then(() => res.sendStatus(200))
    .catch(() => res.sendStatus(300))
})

router.put('/info', (req, res) => {
  Bus.findOne({ _id: req.query.bid })
    .then((bus) => {
      const { info } = req.body
      bus.info = info
      bus.save()
      res.sendStatus(200)
    })
    .catch(() => {
      res.sendStatus(404)
    })
})

router.get('/info', (req, res) => {
  Bus.findOne({ _id: req.query.bid })
    .then((bus) => {
      const { info, rate, tgChatId, login } = bus
      res.send({ info, rate, tgChatId, login })
    })
    .catch(() => {
      res.sendStatus(404)
    })
})

router.get('/checkInfo', (req, res) => {
  Bus.findOne({ _id: req.query.bid })
    .then((bus) => {
      const tg = !!bus.tgChatId
      const title = !!bus.info?.title
      const addr = !!bus.info?.addr
      res.send({ tg, title, addr })
    })
    .catch(() => res.sendStatus(404))
})

router.put('/menu', (req, res) => {
  Bus.findOne({ _id: req.query.bid })
    .then((bus) => {
      bus.menu.push(req.body.pos)
      bus.save()
      res.sendStatus(200)
    })
    .catch(() => res.sendStatus(404))
})

router.put('/popPos', (req, res) => {
  Bus.findOne({ _id: req.query.bid })
    .then((bus) => {
      bus.menu = bus.menu.filter(pos => pos.id !== req.body.target)
      bus.save()
      res.sendStatus(200)
    })
    .catch(() => res.sendStatus(404))
})

router.get('/menuPage', (req, res) => {
  Bus.findOne({ _id: req.query.bid })
    .then((bus) => {
      const { info, menu } = bus
      const currency = info?.currency
      res.send({ currency, menu })
    })
    .catch(() => res.sendStatus(404))
})

router.get('/queryShops', (req, res) => {
  const { query } = req.query
  Bus.find({ "info.title": { "$regex": query, "$options": "i" } })
    .then((buses) => {
      res.send(buses)
    })
})

router.get('/locShops', (req, res) => {
  const { skip, limit, city } = req.query
  Bus.find({ "info.addr.city": city }).skip(skip).limit(limit)
    .then((buses) => {
      res.send(buses)
    })
})

router.get('/shops', (req, res) => {
  const { skip, limit } = req.query
  Bus.find({}).skip(skip).limit(limit)
    .then((buses) => {
      res.send(buses)
    })
    .catch(() => {
      res.sendStatus(404)
    })
})

router.get('/shop', (req, res) => {
  Bus.findOne({ _id: req.query.bid })
    .then((bus) => {
      const { info, menu, tgChatId, rate, secretWord } = bus
      res.send({ info, menu, tgChatId, rate, secretWord })
    })
    .catch(() => res.sendStatus(404))
})

router.get('/rate', (req, res) => {
  Bus.findOne({ _id: req.query.bid })
    .then((bus) => {
      const { rate } = bus
      res.send({ rate })
    })
    .catch(() => {
      res.sendStatus(404)
    })
})

module.exports = router