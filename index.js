const http = require('http')
const imageRouter = require('./app/imageRouter')
const tagsRouter = require('./app/tagsRouter')
const filtersRouter = require('./app/filtersRouter')
const usersRouter = require('./app/usersRouter')
const profilesRouter = require('./app/profilesRouter')

require('dotenv').config()

const PORT = process.env.APP_PORT

http.createServer(async (req, res) => {
    console.log(req.url)
    console.log(req.method)

    if (req.url.search('/api/photos') !== -1) {
        await imageRouter(req, res)
    } else if (req.url.search('/api/tags') !== -1) {
        await tagsRouter(req, res)
    } else if (req.url.search('/api/filters') !== -1 || req.url.search('/api/getfile') !== -1) {
        await filtersRouter(req, res)
    } else if (req.url.search('/api/user') !== -1) {
        await usersRouter(req, res)
    } else if (req.url.search('/api/profile') !== -1) {
        await profilesRouter(req, res)
    }
}).listen(PORT, () => console.log(`listen on ${PORT}`))

const ip = Object.values(require('os').networkInterfaces()).reduce((r, list) => r.concat(list.reduce((rr, i) => rr.concat((i.family === 'IPv4' && !i.internal && i.address) || []), [])), [])

console.log('ip')
console.log(ip)
