function messageCreator(pTime, order, bid, sum, nickname) {
  let str = '\n\n'
  const timeStr = `\npickup order at: ${pTime}`
  for (let item in order) {
    str += `${order[item][bid].title}: ${order[item][bid].option}\n`
  }
  str += `\nTotal: ${sum.toString()}`
  const message = `${nickname} ${timeStr} ${str}`
  return message
}

module.exports = messageCreator