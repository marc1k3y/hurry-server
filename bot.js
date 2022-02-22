process.env.NTBA_FIX_319 = 1
const { hashSync } = require('bcrypt')
const TelegramBot = require('node-telegram-bot-api')
const token = '5256358257:AAHycrRz69NfNrodveepnQPa334ygQviXSg'
const bot = new TelegramBot(token, { polling: true })
const Bus = require('./models/bus')
const User = require('./models/user')
const messageCreator = require('./utils/messageCreator')

// send order
async function sendOrder(chatId, nickname, order, pTime, bid, sum) {
  if (!chatId) return
  try {
    let message
    message = messageCreator(pTime, order, bid, sum, nickname)
    await bot.sendMessage(chatId, message)
  } catch {
    return
  }
}

// change password
async function changePass(client, id, newPass) {
  switch (client) {
    case 'guest':
      User.findOne({ _id: id })
        .then((user) => {
          user.password = hashSync(newPass, 5)
          user.save()
          bot.sendMessage(user.tgChatId, `${user.info?.nickname} your password changed`)
        })
      break
    case 'bus':
      Bus.findOne({ _id: id })
        .then((bus) => {
          bus.password = hashSync(newPass, 5)
          bus.save()
          bot.sendMessage(bus.tgChatId, `${bus.info?.title} password changed`)
        })
      break
    default:
      return
  }
}

// forgot
async function forgotPass(chatId, password) {
  if (!chatId) return
  try {
    await bot.sendMessage(chatId, `Your password: ${password}`)
  }
  catch {
    return
  }
}

// start 
bot.onText(/\/start (.+)/, (msg) => {
  bot.sendMessage(msg.chat.id, 'Hello, please paste your clipboard me.')
})

// register
bot.onText(/\/register (.+)/, (msg) => {
  const chatId = msg.chat.id
  const connId = msg.text.split(' ')[1]
  switch (connId.charAt(0)) {
    case 'u':
      User.findOne({ connectId: connId })
        .then((user) => {
          user.tgChatId = chatId
          user.save()
          bot.sendMessage(chatId, `Congratulation ${user.info?.nickname}`)
        })
        .catch(() => bot.sendMessage(chatId, 'Please try again'))
      break
    case 'b':
      Bus.findOne({ connectId: connId })
        .then((bus) => {
          bus.tgChatId = chatId
          bus.save()
          bot.sendMessage(chatId, `Congratulation ${bus.info?.title}`)
        })
        .catch(() => bot.sendMessage(chatId, 'Please try again'))
      break
    default:
      bot.sendMessage(chatId, 'Please try again')
  }
})

module.exports = { sendOrder, forgotPass, changePass }