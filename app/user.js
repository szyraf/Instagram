class User {
    constructor(id, name, lastName, email, confirmed, password) {
        this.id = id
        this.name = name
        this.lastName = lastName
        this.email = email
        this.confirmed = confirmed
        this.password = password
    }
}

let usersArray = []
let expiredTokens = []

module.exports = { User, usersArray, expiredTokens }
