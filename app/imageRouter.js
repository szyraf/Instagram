const fileController = require('./fileController')

const router = async (req, res) => {
    if (req.url === '/api/photos' && req.method === 'POST') {
        fileController.upload(req, res)
    } else if (req.url === '/api/photos' && req.method === 'GET') {
        fileController.getAll(req, res)
    } else if (req.url.match(/\/api\/photos\/([0-9]+)/) && req.method === 'GET') {
        fileController.get(req, res)
    } else if (req.url.match(/\/api\/photos\/([0-9]+)/) && req.method === 'DELETE') {
        fileController.delete(req, res)
    } else if (req.url === '/api/photos' && req.method === 'PATCH') {
        fileController.update(req, res)
    } else if (req.url === '/api/photos/tags' && req.method === 'PATCH') {
        fileController.updateTags(req, res)
    } else if (req.url === '/api/photos/tags/mass' && req.method === 'PATCH') {
        fileController.updateTagsMass(req, res)
    } else if (req.url.match(/\/api\/photos\/tags\/([0-9]+)/) && req.method === 'GET') {
        fileController.getTags(req, res)
    } else if (req.url.match(/\/api\/photos\/([\s\S]*)/) && req.method === 'GET') {
        fileController.getFilesFromFolder(req, res)
    }
}

module.exports = router
