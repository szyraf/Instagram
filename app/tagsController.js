const formidable = require('formidable')
const path = require('path')
let { Photo, photosArray } = require('./photo')
let { Tag, tagsArray } = require('./tag')
const getRequestData = require('./getRequestData')
const fs = require('fs')

let tags = ['#love', '#instagood', '#fashion', '#photooftheday', '#art', '#photography', '#instagram', '#beautiful', '#picoftheday', '#nature', '#happy', '#cute', '#travel', '#style', '#followme', '#tbt', '#instadaily', '#repost', '#like4like', '#summer', '#beauty', '#fitness', '#food', '#selfie', '#me', '#instalike', '#girl', '#friends', '#fun', '#photo']
tags.forEach((tag, index) => {
    tagsArray.push(new Tag(index, tag, Math.floor(Math.random() * 1000)))
})

module.exports = {
    rawTags: (req, res) => {
        res.statusCode = 200
        res.setHeader('Content-Type', 'application/json')
        res.end(JSON.stringify(tagsArray.map((tag) => tag.tag)))
    },
    tagObjects: (req, res) => {
        res.statusCode = 200
        res.setHeader('Content-Type', 'application/json')
        res.end(JSON.stringify(tagsArray))
    },
    getTag: (req, res) => {
        const id = req.url.match(/\/api\/tags\/([0-9]+)/)[1]
        res.statusCode = 200
        res.setHeader('Content-Type', 'application/json')
        res.end(JSON.stringify(tagsArray[id]))
    },
    createTag: async (req, res) => {
        let data = await getRequestData(req)
        data = JSON.parse(data)

        if (!tagsArray.find((tag) => tag.tag === data.tag)) {
            let tag = new Tag(tagsArray.length, data.tag, data.popularity)
            console.log(tag)
            tagsArray.push(tag)

            res.statusCode = 200
            res.setHeader('Content-Type', 'application/json')
            res.end(JSON.stringify({ status: 'tag created', tag: tag }))
        } else {
            res.statusCode = 409
            res.setHeader('Content-Type', 'application/json')
            res.end(JSON.stringify({ status: 'tag already exists' }))
        }
    },
}
