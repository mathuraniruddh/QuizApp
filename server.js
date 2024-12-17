require('dotenv').config()
const express = require('express')
const app = express();
const route = require('./routes/main')
const bodyParser = require('body-parser')
app.use(bodyParser.urlencoded({ extended: false }))
app.use(bodyParser.json())
app.use('/api',route);
app.listen(process.env.PORT)
