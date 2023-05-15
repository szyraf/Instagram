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

        let newurl = ''

        if (filter === 'rotate') {
            let rotate = await sharp(photo.url).rotate(90).toFile(photo.url.split('.')[0] + '-rotate.jpg');
            newurl = photo.url.split('.')[0] + '-rotate.jpg'
        }

        photo.history.push({
            status: filter,
            timestamp: new Date().toISOString(),
            url: newurl,
        })

        photo.lastChange = filter

        res.statusCode = 200
        res.setHeader('Content-Type', 'application/json')
        res.end(JSON.stringify(photo.getJSON()))
    }
}
