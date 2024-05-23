const express = require('express')
const app = express()
const port = 3002
const route = require('./src/routes')
const morgan = require('morgan')

//use middlewares
app.use(morgan('dev'))
app.use(express.json())
app.use(express.urlencoded({
    extended: true
}))

//routing
route(app);

app.listen(port, () => {
  console.log(`App server listening on port ${port}`)
})