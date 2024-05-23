const express = require('express')
const app = express()
const port = 3002
const route = require('./src/routes')
const morgan = require('morgan')
const db = require('./src/config/connectdb')
//load env file
require('dotenv').config();

//use middlewares
app.use(morgan('dev'))
app.use(express.json())
app.use(express.urlencoded({
    extended: true
}))

//connectdb
db.connect()

//routing
route(app);

app.listen(port, () => {
  console.log(`App server listening on port ${port}`)
})