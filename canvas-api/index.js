require('dotenv').config()
const express = require('express')
const { name, version } = require('./package.json')
const { env: { PORT, DB_URL } } = process
const cors = require('./utils/cors')
const { database } = require('canvas-data')

const api = express

api.use(cors)

api.options('*', cors,(req,res)=>{
    res.end()
})

//TODO routes



database.connect(DB_URL)
    .then(()=> api.listen(PORT, () => console.log(`${name}  ${version} up running on port ${PORT}`)))