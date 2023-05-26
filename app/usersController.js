const formidable = require('formidable')
const path = require('path')
let { User, usersArray } = require('./user')
const getRequestData = require('./getRequestData')
const fs = require('fs')
const bcrypt = require('bcryptjs')
const jwt = require('jsonwebtoken')

require('dotenv').config()

const createToken = async (email) => {
    let token = await jwt.sign(
        {
            email: email
        },
        process.env.SECRET_KEY,
        {
            expiresIn: '1h'
        }
    )
    return token
}

module.exports = {
    register: async (req, res) => {
        let data = await getRequestData(req)
        data = JSON.parse(data)

        if (data.name === undefined || data.lastName === undefined || data.email === undefined || data.password === undefined) {
            res.statusCode = 400
            res.setHeader('Content-Type', 'application/json')
            res.end(JSON.stringify({ status: 'error', message: 'missing data' }))
            return
        }

        let user = usersArray.find((user) => user.email === data.email)

        if (user !== undefined) {
            res.statusCode = 400
            res.setHeader('Content-Type', 'application/json')
            res.end(JSON.stringify({ status: 'error', message: 'user already exists' }))
            return
        }

        let id = usersArray.length === 0 ? 1 : usersArray[usersArray.length - 1].id + 1
        let name = data.name
        let lastName = data.lastName
        let email = data.email
        let password = bcrypt.hashSync(data.password, 10)
        let confirmed = false

        let newUser = new User(id, name, lastName, email, confirmed, password)

        usersArray.push(newUser)

        let token = await createToken(email)

        res.statusCode = 200
        res.setHeader('Content-Type', 'application/json')
        res.end(
            JSON.stringify({
                status: 'ok',
                message: `skopiuj poniższy link do przeglądarki: http://localhost:3000/api/user/confirm/${token} w celu potwierdzenia konta. Uwaga: link jest ważny przez godzinę`
            })
        )
    },
    confirm: async (req, res) => {
        let token = req.url.match(/\/api\/user\/confirm\/([a-zA-Z0-9.\-_]+)/)[1]

        try {
            let decoded = await jwt.verify(token, process.env.SECRET_KEY)

            let user = usersArray.find((user) => user.email === decoded.email)
            if (user === undefined) {
                res.statusCode = 400
                res.setHeader('Content-Type', 'application/json')
                res.end(JSON.stringify({ status: 'error', message: 'user not found' }))
                return
            }

            if (user.confirmed) {
                res.statusCode = 400
                res.setHeader('Content-Type', 'application/json')
                res.end(JSON.stringify({ status: 'error', message: 'user already confirmed' }))
                return
            }

            user.confirmed = true

            res.statusCode = 200
            res.setHeader('Content-Type', 'application/json')
            res.end(JSON.stringify({ status: 'ok', message: 'user confirmed' }))
        } catch (ex) {
            res.statusCode = 400
            res.setHeader('Content-Type', 'application/json')
            res.end(JSON.stringify({ status: 'error', message: 'token expired' }))
        }
    },
    login: async (req, res) => {
        let data = await getRequestData(req)
        data = JSON.parse(data)

        if (data.email === undefined || data.password === undefined) {
            res.statusCode = 400
            res.setHeader('Content-Type', 'application/json')
            res.end(JSON.stringify({ status: 'error', message: 'missing data' }))
            return
        }

        let user = usersArray.find((user) => user.email === data.email)

        if (user === undefined) {
            res.statusCode = 400
            res.setHeader('Content-Type', 'application/json')
            res.end(JSON.stringify({ status: 'error', message: 'email not found' }))
            return
        }

        if (!user.confirmed) {
            res.statusCode = 400
            res.setHeader('Content-Type', 'application/json')
            res.end(JSON.stringify({ status: 'error', message: 'user not confirmed' }))
            return
        }

        if (!bcrypt.compareSync(data.password, user.password)) {
            res.statusCode = 400
            res.setHeader('Content-Type', 'application/json')
            res.end(JSON.stringify({ status: 'error', message: 'wrong password' }))
        }

        let newToken = await createToken(user.email)

        res.statusCode = 200
        res.setHeader('Content-Type', 'application/json')
        res.end(JSON.stringify({ status: 'ok', message: 'user logged in', token: newToken }))
    },
    allUsers: async (req, res) => {
        if (usersArray.length === 0) {
            res.statusCode = 400
            res.setHeader('Content-Type', 'application/json')
            res.end(JSON.stringify({ status: 'error', message: 'no users' }))
            return
        }

        res.statusCode = 200
        res.setHeader('Content-Type', 'application/json')
        res.end(JSON.stringify({ status: 'ok', message: 'all users', users: usersArray }))
    }
}
