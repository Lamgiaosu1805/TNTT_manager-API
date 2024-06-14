const bcrypt = require('bcrypt');
async function generatePassword() {
  const min = 10000
  const max = 99999
  const randomNumber = Math.floor(Math.random() * (max - min + 1)) + min
  const password = "admin"+randomNumber+"@"
  const salt = await bcrypt.genSalt(10);
  const hashed = await bcrypt.hash(password, salt);
  return {
    hashedPassword: hashed,
    realPassword: password
  };
}

module.exports = generatePassword