const tagsController = require('./tagsController')

const router = async (req, res) => {
    if (req.url === '/api/tags/raw' && req.method === 'GET') {
        tagsController.rawTags(req, res)
    } else if (req.url === '/api/tags' && req.method === 'GET') {
        tagsController.tagObjects(req, res)
    } else if (req.url.match(/\/api\/tags\/([0-9]+)/) && req.method === 'GET') {
        tagsController.getTag(req, res)
    } else if (req.url === '/api/tags' && req.method === 'POST') {
        tagsController.createTag(req, res)
    }
}

module.exports = router
