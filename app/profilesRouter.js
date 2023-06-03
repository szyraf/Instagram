const profilesController = require('./profilesController')

/*

a) GET /api/profile // pobranie danych usera do wyświetlenia w profilu
b) PATCH /api/profile // aktualizacja danych usera w jego profilu
c) POST /api/profile // wysłanie zdjęcia profilowego

*/

const router = async (req, res) => {
    if (req.url === '/api/profile' && req.method === 'GET') {
        await profilesController.getProfile(req, res)
    } else if (req.url === '/api/profile' && req.method === 'PATCH') {
        await profilesController.updateProfile(req, res)
    } else if (req.url === '/api/profile' && req.method === 'POST') {
        await profilesController.uploadProfilePhoto(req, res)
    }
}

module.exports = router
