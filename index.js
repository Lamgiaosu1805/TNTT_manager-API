const express = require('express')
const app = express()
const port = 3002
const route = require('./src/routes')
const morgan = require('morgan')
const db = require('./src/config/connectdb')
const Migrate = require('./src/utils/MigateDB')
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

//Migrate db
// Migrate();

//routing
route(app);

app.listen(port, () => {
  console.log(`App service listening on port ${port}`)
})