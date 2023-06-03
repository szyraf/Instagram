const formidable = require('formidable')
const path = require('path')
let { User, usersArray, expiredTokens } = require('./user')
const getRequestData = require('./getRequestData')
const fs = require('fs')
const bcrypt = require('bcryptjs')
const jwt = require('jsonwebtoken')

require('dotenv').config()

module.exports = {
    getProfile: async (req, res) => {
        if (req.headers.authorization && req.headers.authorization.startsWith('Bearer')) {
            let token = req.headers.authorization.split(' ')[1]

            if (token === undefined) {
                res.statusCode = 400
                res.setHeader('Content-Type', 'application/json')
                res.end(JSON.stringify({ status: 'error', message: 'invalid token' }))
                return
            }

            if (expiredTokens.includes(token)) {
                res.statusCode = 400
                res.setHeader('Content-Type', 'application/json')
                res.end(JSON.stringify({ status: 'error', message: 'token expired' }))
                return
            }

            try {
                let decoded = await jwt.verify(token, process.env.SECRET_KEY)

                if (decoded === undefined) {
                    res.statusCode = 400
                    res.setHeader('Content-Type', 'application/json')
                    res.end(JSON.stringify({ status: 'error', message: 'invalid token' }))
                    return
                }

                if (decoded.login !== 'yes') {
                    res.statusCode = 400
                    res.setHeader('Content-Type', 'application/json')
                    res.end(JSON.stringify({ status: 'error', message: 'user not logged in' }))
                    return
                }

                let user = usersArray.find((user) => user.email === decoded.email)

                if (user === undefined) {
                    res.statusCode = 400
                    res.setHeader('Content-Type', 'application/json')
                    res.end(JSON.stringify({ status: 'error', message: 'user not found' }))
                    return
                }

                if (user.confirmed === false) {
                    res.statusCode = 400
                    res.setHeader('Content-Type', 'application/json')
                    res.end(JSON.stringify({ status: 'error', message: 'user not confirmed' }))
                    return
                }

                res.statusCode = 200
                res.setHeader('Content-Type', 'application/json')
                res.end(JSON.stringify({ status: 'success', message: 'user found', data: user }))
                return
            } catch (ex) {
                res.statusCode = 400
                res.setHeader('Content-Type', 'application/json')
                res.end(JSON.stringify({ status: 'error', message: 'token expired' }))
                return
            }
        }

        res.statusCode = 400
        res.setHeader('Content-Type', 'application/json')
        res.end(JSON.stringify({ status: 'error', message: 'invalid token' }))
    },
    updateProfile: async (req, res) => {
        if (req.headers.authorization && req.headers.authorization.startsWith('Bearer')) {
            let token = req.headers.authorization.split(' ')[1]

            if (token === undefined) {
                res.statusCode = 400
                res.setHeader('Content-Type', 'application/json')
                res.end(JSON.stringify({ status: 'error', message: 'invalid token' }))
                return
            }

            if (expiredTokens.includes(token)) {
                res.statusCode = 400
                res.setHeader('Content-Type', 'application/json')
                res.end(JSON.stringify({ status: 'error', message: 'token expired' }))
                return
            }

            try {
                let decoded = await jwt.verify(token, process.env.SECRET_KEY)

                if (decoded === undefined) {
                    res.statusCode = 400
                    res.setHeader('Content-Type', 'application/json')
                    res.end(JSON.stringify({ status: 'error', message: 'invalid token' }))
                    return
                }

                if (decoded.login !== 'yes') {
                    res.statusCode = 400
                    res.setHeader('Content-Type', 'application/json')
                    res.end(JSON.stringify({ status: 'error', message: 'user not logged in' }))
                    return
                }

                let user = usersArray.find((user) => user.email === decoded.email)

                if (user === undefined) {
                    res.statusCode = 400
                    res.setHeader('Content-Type', 'application/json')
                    res.end(JSON.stringify({ status: 'error', message: 'user not found' }))
                    return
                }

                if (user.confirmed === false) {
                    res.statusCode = 400
                    res.setHeader('Content-Type', 'application/json')
                    res.end(JSON.stringify({ status: 'error', message: 'user not confirmed' }))
                    return
                }

                let data = await getRequestData(req)
                data = JSON.parse(data)

                if (data.name !== undefined) {
                    user.name = data.name
                }

                if (data.lastName !== undefined) {
                    user.lastName = data.lastName
                }

                if (data.email !== undefined) {
                    user.email = data.email
                }

                if (data.password !== undefined) {
                    user.password = await bcrypt.hash(data.password, 10)
                }

                res.statusCode = 200
                res.setHeader('Content-Type', 'application/json')
                res.end(JSON.stringify({ status: 'success', message: 'user updated', data: user }))
                return
            } catch (ex) {
                res.statusCode = 400
                res.setHeader('Content-Type', 'application/json')
                res.end(JSON.stringify({ status: 'error', message: 'token expired' }))
                return
            }
        }

        res.statusCode = 400
        res.setHeader('Content-Type', 'application/json')
        res.end(JSON.stringify({ status: 'error', message: 'invalid token' }))
    },
    uploadProfilePhoto: async (req, res) => {
        if (req.headers.authorization && req.headers.authorization.startsWith('Bearer')) {
            let token = req.headers.authorization.split(' ')[1]

            if (token === undefined) {
                res.statusCode = 400
                res.setHeader('Content-Type', 'application/json')
                res.end(JSON.stringify({ status: 'error', message: 'invalid token' }))
                return
            }

            if (expiredTokens.includes(token)) {
                res.statusCode = 400
                res.setHeader('Content-Type', 'application/json')
                res.end(JSON.stringify({ status: 'error', message: 'token expired' }))
                return
            }

            try {
                let decoded = await jwt.verify(token, process.env.SECRET_KEY)

                if (decoded === undefined) {
                    res.statusCode = 400
                    res.setHeader('Content-Type', 'application/json')
                    res.end(JSON.stringify({ status: 'error', message: 'invalid token' }))
                    return
                }

                if (decoded.login !== 'yes') {
                    res.statusCode = 400
                    res.setHeader('Content-Type', 'application/json')
                    res.end(JSON.stringify({ status: 'error', message: 'user not logged in' }))
                    return
                }

                let user = usersArray.find((user) => user.email === decoded.email)

                if (user === undefined) {
                    res.statusCode = 400
                    res.setHeader('Content-Type', 'application/json')
                    res.end(JSON.stringify({ status: 'error', message: 'user not found' }))
                    return
                }

                if (user.confirmed === false) {
                    res.statusCode = 400
                    res.setHeader('Content-Type', 'application/json')
                    res.end(JSON.stringify({ status: 'error', message: 'user not confirmed' }))
                    return
                }

                // TODO: upload file

                /*

                console.log('aaaaaaaaaaaa')

                const form = formidable({
                    multiples: true,
                    uploadDir: 'temp',
                    keepExtensions: true
                })

                console.log('bbbbbbbbbbbb')

                form.parse(req, (err, fields, files) => {
                    if (err) {
                        res.statusCode = 400
                        res.setHeader('Content-Type', 'text/plain')
                        res.end(String(err))
                        return
                    }

                    const tempPath = files.myFile.path
                    const targetFolder = path.join('uploads', user.email)
                    const targetPath = path.join('uploads', user.email, files.myFile.path.slice(5))

                    console.log('cccccccccccc')
                    console.log(tempPath)
                    console.log(targetFolder)
                    console.log(targetPath)

                    if (!fs.existsSync(targetFolder)) {
                        fs.mkdirSync(targetFolder)
                    }

                    fs.rename(tempPath, targetPath, (err) => {
                        if (err) {
                            res.statusCode = 500
                            res.setHeader('Content-Type', 'text/plain')
                            res.end(String(err))
                            return
                        }
                    })

                    let id = parseInt(`${Date.now()}${Math.floor(Math.random() * 1000)}`)
                    let album = user.email
                    let originalName = files.myFile.name
                    let url = targetPath
                    let lastChange = 'original'
                    let history = [
                        {
                            status: 'original',
                            timestamp: new Date().toISOString()
                        }
                    ]

                    let photo = new Photo(id, album, originalName, url, lastChange, history)
                    photosArray.push(photo)

                    res.statusCode = 200
                    res.setHeader('Content-Type', 'application/json')
                    res.end(JSON.stringify(photo.getJSON()))
                })

                */
            } catch (ex) {
                res.statusCode = 400
                res.setHeader('Content-Type', 'application/json')
                res.end(JSON.stringify({ status: 'error', message: 'token expired' }))
                return
            }
        }

        res.statusCode = 400
        res.setHeader('Content-Type', 'application/json')
        res.end(JSON.stringify({ status: 'error', message: 'invalid token' }))
    }
}
