const authRouter = require('./auth')

const api_ver = "/api/v1"
const route = (app) => {
    app.use(`${api_ver}/auth`, authRouter)
}

module.exports = route;