const bcrypt = require('bcryptjs')

const pass = 'moje tajne hasło'

const encryptPass = async (password) => {
    let encryptedPassword = await bcrypt.hash(password, 10)
    console.log('bbbb')
    console.log({ encryptedPassword: encryptedPassword })
}

encryptPass(pass)

const decryptPass = async (userpass, encrypted) => {
    let decrypted = await bcrypt.compare(userpass, encrypted)
    console.log('cccc')
    console.log(decrypted)
}

decryptPass(pass, '$2a$10$LfqSjAWbL1i/tvnpn40CB.Wy9smwZqnZz/YDO7YjLJBAnxHzztRSS')

console.log('aaa')
