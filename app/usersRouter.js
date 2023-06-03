const usersController = require('./usersController')

const router = async (req, res) => {
    if (req.url === '/api/user/register' && req.method === 'POST') {
        await usersController.register(req, res)
    } else if (req.url.match(/\/api\/user\/confirm\/([a-zA-Z0-9.\-_]+)/) && req.method === 'GET') {
        await usersController.confirm(req, res)
    } else if (req.url === '/api/user/login' && req.method === 'POST') {
        await usersController.login(req, res)
    } else if (req.url === '/api/user' && req.method === 'GET') {
        await usersController.allUsers(req, res)
    } else if (req.url === '/api/user/logout' && req.method === 'GET') {
        await usersController.logout(req, res)
    }
}

module.exports = router
