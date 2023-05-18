const userController = require('./userController')

/*
a) POST /api/user/register // register usera
b) GET /api/user/confirm/<token> // user potwierdza rejestrację konta z użyciem tokena
c) POST /api/user/login // logowanie z odesłaniem tokena po zalogowaniu - od tej pory każde żądanie zawiera token
d) GET /api/user // json all users - funkcja pomocnicza dla testów
*/

const router = async (req, res) => {
    if (req.url === '/api/user/register' && req.method === 'POST') {
        await userController.register(req, res)
    } else if (req.url.match(/\/api\/user\/confirm\/(^[\w-]*\.[\w-]*\.[\w-]*$)/) && req.method === 'GET') {
        await userController.confirm(req, res)
    } else if (req.url === '/api/user/login' && req.method === 'POST') {
        await userController.login(req, res)
    } else if (req.url === '/api/user' && req.method === 'GET') {
        await userController.allUsers(req, res)
    }
}

module.exports = router
