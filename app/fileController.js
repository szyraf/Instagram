const formidable = require('formidable')
const path = require('path')
let { Photo, photosArray } = require('./photo')
let { Tag, tagsArray } = require('./tag')
const getRequestData = require('./getRequestData')
const fs = require('fs')

module.exports = {
    upload: (req, res) => {
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
            const targetPath = path.join('uploads', fields.album, files.myFile.path.slice(5))

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
            let album = fields.album
            let originalName = files.myFile.name
            let url = targetPath
            let lastChange = 'original'
            let history = [
                {
                    status: 'original',
                    timestamp: new Date().toISOString(),
                },
            ]

            let photo = new Photo(id, album, originalName, url, lastChange, history)
            photosArray.push(photo)

            res.statusCode = 200
            res.setHeader('Content-Type', 'application/json')
            res.end(JSON.stringify(photo.getJSON()))
        })
    },
    getAll: (req, res) => {
        let arr = []
        photosArray.forEach((photo) => arr.push(photo.getJSON()))

        res.statusCode = 200
        res.setHeader('Content-Type', 'application/json')
        res.end(JSON.stringify(arr))
    },
    get: (req, res) => {
        let id = parseInt(req.url.match(/\/api\/photos\/([0-9]+)/)[1])

        let photo = photosArray.find((photo) => photo.id === id)

        if (photo === undefined) {
            res.statusCode = 404
            res.setHeader('Content-Type', 'application/json')
            res.end(JSON.stringify({ status: 'photo not found', id: id }))
            return
        }

        res.statusCode = 200
        res.setHeader('Content-Type', 'application/json')
        res.end(JSON.stringify(photo.getJSON()))
    },
    delete: (req, res) => {
        let id = parseInt(req.url.match(/\/api\/photos\/([0-9]+)/)[1])

        let photo = photosArray.find((photo) => photo.id === id)

        if (photo === undefined) {
            res.statusCode = 404
            res.setHeader('Content-Type', 'application/json')
            res.end(JSON.stringify({ status: 'photo not found', id: id }))
            return
        }

        photosArray = photosArray.filter((photo) => photo.id !== id)

        fs.unlinkSync(photo.url)

        res.statusCode = 200
        res.setHeader('Content-Type', 'application/json')
        res.end(JSON.stringify({ status: 'photo deleted', id: id }))
    },
    update: async (req, res) => {
        let data = await getRequestData(req)
        data = JSON.parse(data)

        let id = parseInt(data.id)
        let status = data.status

        let photo = photosArray.find((photo) => photo.id === id)

        if (photo === undefined) {
            res.statusCode = 404
            res.setHeader('Content-Type', 'application/json')
            res.end(JSON.stringify({ status: 'photo not found', id: id }))
            return
        }

        photo.history.push({
            status: status,
            timestamp: new Date().toISOString(),
        })

        photo.lastChange = status

        res.statusCode = 200
        res.setHeader('Content-Type', 'application/json')
        res.end(JSON.stringify(photo.getJSON()))
    },
    updateTags: async (req, res) => {
        let data = await getRequestData(req)
        data = JSON.parse(data)

        let id = parseInt(data.id)
        let newTag = data.tag

        if (tagsArray.find((tag) => tag.tag === newTag) !== undefined) {
            let photo = photosArray.find((photo) => photo.id === id)
            if (photo === undefined) {
                res.statusCode = 404
                res.setHeader('Content-Type', 'application/json')
                res.end(JSON.stringify({ status: 'photo not found', id: id }))
            } else {
                if (photo.tags.find((tag) => tag.tag === newTag) !== undefined) {
                    res.statusCode = 400
                    res.setHeader('Content-Type', 'application/json')
                    res.end(JSON.stringify({ status: 'tag already exists', id: id }))
                    return
                }
                photo.tags.push({
                    newTag,
                    popularity: photo.tags.length,
                })

                res.statusCode = 200
                res.setHeader('Content-Type', 'application/json')
                res.end(JSON.stringify(photo.getJSON()))
            }
        }
    },
    updateTagsMass: async (req, res) => {
        let data = await getRequestData(req)
        data = JSON.parse(data)

        let id = parseInt(data.id)
        let newTags = data.tags

        let photo = photosArray.find((photo) => photo.id === id)
        if (photo === undefined) {
            res.statusCode = 404
            res.setHeader('Content-Type', 'application/json')
            res.end(JSON.stringify({ status: 'photo not found', id: id }))
        } else {
            let isAnyTagExists = false
            newTags.forEach((newTag) => {
                if (tagsArray.find((tag) => tag.tag === newTag) !== undefined) {
                    if (photo.tags.find((photoTag) => photoTag.tag === newTag) === undefined) {
                        isAnyTagExists = true
                        photo.tags.push({
                            newTag,
                            popularity: photo.tags.length,
                        })
                    }
                }
            })

            if (!isAnyTagExists) {
                res.statusCode = 400
                res.setHeader('Content-Type', 'application/json')
                res.end(JSON.stringify({ status: 'no tags exists', id: id }))
                return
            }

            res.statusCode = 200
            res.setHeader('Content-Type', 'application/json')
            res.end(JSON.stringify(photo.getJSON()))
        }
    },
    getTags: (req, res) => {
        let id = parseInt(req.url.match(/\/api\/photos\/tags\/([0-9]+)/)[1])

        let photo = photosArray.find((photo) => photo.id === id)

        if (photo === undefined) {
            res.statusCode = 404
            res.setHeader('Content-Type', 'application/json')
            res.end(JSON.stringify({ status: 'photo not found', id: id }))
            return
        }

        res.statusCode = 200
        res.setHeader('Content-Type', 'application/json')
        res.end(
            JSON.stringify({
                id: photo.id,
                tags: photo.tags,
            })
        )
    },
}
