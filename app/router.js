const formidable = require('formidable')
const path = require('path')
const fs = require('fs')
const { Photo, photosArray } = require('./model')

const router = async (req, res) => {
    console.log(req.url)
    console.log(req.method)

    if (req.url == '/api/photos' && req.method == 'POST') {
        const form = formidable({
            multiples: true,
            uploadDir: 'temp',
            keepExtensions: true,
        })

        form.parse(req, (err, fields, files) => {
            if (err) {
                res.statusCode = 400
                res.setHeader('Content-Type', 'text/plain')
                res.end(String(err))
                return
            }

            const tempPath = files.myFile.path
            const targetFolder = path.join('uploads', fields.album)
            const targetPath = path.join('uploads', fields.album, files.myFile.name)

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

            console.log('aaa')

            console.log(`${Date.now()}${Math.floor(Math.random() * 1000)}`)

            /*
            let photo = new Photo()
            photosArray.push()
            */

            res.statusCode = 200
            res.setHeader('Content-Type', 'application/json')
            res.end(JSON.stringify({ fields, files }))
        })
    } else if (req.url == '/api/photos' && req.method == 'GET') {
    } else if (req.url.match(/\/api\/photos\/([0-9]+)/) && req.method == 'GET') {
    } else if (req.url.match(/\/api\/photos\/([0-9]+)/) && req.method == 'DELETE') {
    } else if (req.url == '/api/photos' && req.method == 'PATCH') {
    }

    /*
        case 'POST':
            if (req.url == '/add') {
                let data = await getRequestData(req)
                res.writeHead(200, { 'Content-Type': 'application/json;charset=utf-8' })
                res.write(JSON.stringify({ status: 'animal added', data: controller.getall() }))
                res.end()
                */
}

module.exports = router
