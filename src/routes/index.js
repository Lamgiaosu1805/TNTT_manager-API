const authRouter = require('./auth')
const xuDoanRouter = require('./xuDoan')
const userRouter = require('./user')
const nganhRouter = require('./nganh')

const api_ver = "/api/v1"
const route = (app) => {
    app.use(`${api_ver}/auth`, authRouter)
    app.use(`${api_ver}/xuDoan`, xuDoanRouter)
    app.use(`${api_ver}/user`, userRouter)
    app.use(`${api_ver}/nganh`, nganhRouter)
}

module.exports = route;