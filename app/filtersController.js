const formidable = require('formidable')
const path = require('path')
let { Photo, photosArray } = require('./photo')
const getRequestData = require('./getRequestData')
const fs = require('fs')
const sharp = require('sharp')

metadataPromise = async (server_image_path) => {
    return new Promise(async (resolve, reject) => {
        try {
            if (server_image_path) {
                let meta = await sharp(server_image_path).metadata()
                resolve(meta)
            } else {
                resolve('url_not_found')
            }
        } catch (err) {
            reject(err.mesage)
        }
    })
}

module.exports = {
    getMetadata: async (req, res) => {
        let id = req.url.match(/\/api\/filters\/metadata\/([0-9]+)/)[1]

        let photo = photosArray.find((photo) => photo.id === parseInt(id))

        if (photo === undefined) {
            res.statusCode = 404
            res.setHeader('Content-Type', 'application/json')
            res.end(JSON.stringify({ status: 'photo not found', id: id }))
            return
        }

        let promise = metadataPromise(photo.url)
            .then((data) => {
                return data
            })
            .catch((err) => {
                return err
            })

        let metadata = await promise
        console.log(metadata)

        res.statusCode = 200
        res.setHeader('Content-Type', 'application/json')
        res.end(JSON.stringify(metadata))
    },
    filter: async (req, res) => {
        let data = await getRequestData(req)
        data = JSON.parse(data)

        let id = parseInt(data.id)
        let filter = data.filter

        let photo = photosArray.find((photo) => photo.id === id)

        if (photo === undefined) {
            res.statusCode = 404
            res.setHeader('Content-Type', 'application/json')
            res.end(JSON.stringify({ status: 'photo not found', id: id }))
            return
        }

        let filters = ['tint', 'rotate', 'crop', 'flip', 'flop', 'grayscale', 'resize']

        if (!filters.includes(filter)) {
            res.statusCode = 404
            res.setHeader('Content-Type', 'application/json')
            res.end(JSON.stringify({ status: 'filter not found', filter: filter }))
            return
        }

        let newurl = photo.url.split('.')[0] + `-${filter}.jpg`

        switch (filter) {
            case 'tint':
                await sharp(photo.url).tint().toFile(newurl)
                break
            case 'rotate':
                await sharp(photo.url).rotate(90).toFile(newurl)
                break
            case 'crop':
                await sharp(photo.url).extract({ width: 200, height: 200, left: 0, top: 0 }).toFile(newurl)
                break
            case 'flip':
                await sharp(photo.url).flip().toFile(newurl)
                break
            case 'flop':
                await sharp(photo.url).flop().toFile(newurl)
                break
            case 'grayscale':
                await sharp(photo.url).grayscale().toFile(newurl)
                break
            case 'resize':
                await sharp(photo.url).resize(200, 200).toFile(newurl)
                break
        }

        photo.history.push({
            status: filter,
            timestamp: new Date().toISOString(),
            url: newurl
        })

        photo.lastChange = filter

        res.statusCode = 200
        res.setHeader('Content-Type', 'application/json')
        res.end(JSON.stringify(photo.getJSON()))
    },
    getFile: async (req, res) => {
        let id = req.url.match(/\/api\/getfile\/([0-9]+)$/)[1]

        let photo = photosArray.find((photo) => photo.id === parseInt(id))

        if (photo === undefined) {
            res.statusCode = 404
            res.setHeader('Content-Type', 'application/json')
            res.end(JSON.stringify({ status: 'photo not found', id: id }))
            return
        }

        fs.readFile(photo.url, (err, data) => {
            if (err) {
                res.statusCode = 404
                res.setHeader('Content-Type', 'application/json')
                res.end(JSON.stringify({ status: 'file not found', id: id }))
                return
            }
            res.statusCode = 200
            res.setHeader('Content-Type', 'image/jpeg')
            res.end(data)
        })
    },
    getFileWithFilter: async (req, res) => {
        let id = req.url.match(/\/api\/getfile\/([0-9]+)\/([a-z]+)$/)[1]
        let filter = req.url.match(/\/api\/getfile\/([0-9]+)\/([a-z]+)$/)[2]

        let photo = photosArray.find((photo) => photo.id === parseInt(id))

        if (photo === undefined) {
            res.statusCode = 404
            res.setHeader('Content-Type', 'application/json')
            res.end(JSON.stringify({ status: 'photo not found', id: id }))
            return
        }

        let filters = ['tint', 'rotate', 'crop', 'flip', 'flop', 'grayscale', 'resize']

        if (!filters.includes(filter)) {
            res.statusCode = 404
            res.setHeader('Content-Type', 'application/json')
            res.end(JSON.stringify({ status: 'filter not found', filter: filter }))
            return
        }

        let filterUrl = photo.url.split('.')[0] + `-${filter}.jpg`

        fs.readFile(filterUrl, (err, data) => {
            if (err) {
                res.statusCode = 404
                res.setHeader('Content-Type', 'application/json')
                res.end(JSON.stringify({ status: 'file not found', id: id }))
                return
            }
            res.statusCode = 200
            res.setHeader('Content-Type', 'image/jpeg')
            res.end(data)
        })
    }
}
