const http = require('http')
const imageRouter = require('./app/imageRouter')
const tagsRouter = require('./app/tagsRouter')
const filtersRouter = require('./app/filtersRouter')

const PORT = 3000

http.createServer(async (req, res) => {
    console.log(req.url)
    console.log(req.method)

    if (req.url.search('/api/photos') !== -1) {
        await imageRouter(req, res)
    } else if (req.url.search('/api/tags') !== -1) {
        await tagsRouter(req, res)
    } else if (req.url.search('/api/filters') !== -1 || req.url.search('/api/getfile') !== -1) {
        await filtersRouter(req, res)
    }
}).listen(PORT, () => console.log(`listen on ${PORT}`))
