const bcrypt = require('bcrypt')

async function hasher(password) {
  const hashPass = await bcrypt.hash(password, 5)
  return hashPass
}

async function uncrypt(hpass, inputPass) {
  const uncryptPass = await bcrypt.compare(inputPass, hpass)
  return uncryptPass
}

module.exports = {
  hasher, uncrypt
} 