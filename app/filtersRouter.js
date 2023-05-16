const filtersController = require('./filtersController')

/*
GET /api/filters/metadata/1650305869815 // dane o zdjęciu, potrzebne do jego obróbki (width,height)
PATCH /api/filters // użycie konkretnego filtra, dane o nim przekazujemy w jsonie
*/

const router = async (req, res) => {
    if (req.url.match(/\/api\/filters\/metadata\/([0-9]+)/) && req.method === 'GET') {
        filtersController.getMetadata(req, res)
    } else if (req.url === '/api/filters' && req.method === 'PATCH') {
        filtersController.filter(req, res)
    } else if (req.url.match(/\/api\/getfile\/([0-9]+)$/) && req.method === 'GET') {
        filtersController.getFile(req, res)
    } else if (req.url.match(/\/api\/getfile\/([0-9]+)\/([a-z]+)$/) && req.method === 'GET') {
        filtersController.getFileWithFilter(req, res)
    }
}

module.exports = router
