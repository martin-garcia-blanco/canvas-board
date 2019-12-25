require('dotenv').config()
const express = require('express')
const { name, version } = require('./package.json')
const { env: { PORT, DB_URL } } = process
const cors = require('./utils/cors')
const { database } = require('canvas-data')
const bodyparser = require('body-parser')
const jsonBodyParser = bodyparser.json()

const api = express

api.use(cors)

api.options('*', cors,(req,res)=>{
    res.end()
})


api.post('/section', jsonBodyParser, (req,res)=>{
    const { body: {name} } = req

    try{
        createSection(name)
        .then(() => res.status(201).end())
        .catch( error => {
            return res.status(500).json({error})
        })
    } catch({message}){
        res.status(400).json({message})
    }
})

api.delete('/section:id', (req,res)=>{
    const { params: { id }} = req

    try {
        deleteSection(id)
        .then(() => res.status(204).end())
        .catch(error => {
            if(error instanceof NotFoundError) return res.status(404).json(error.message)
            if(error instanceof ConflictError) return res.status(409).json(error.message)
            res.status(500).end()
        })
    } catch(error){
        res.status(400).json({message})
    }
})

api.post('/note', bodyparser,(req,res)=>{
    const { body: { text } } = req

    try{
        createNote(text)
        .then(() => res.status(201).end())
        .catch( error => {
            return res.status(500).json({error})
        })
    } catch({message}){
        res.status(400).json(message)
    }
})

api.put('/note:id', jsonBodyParser, (req,res) => {
    const { paramas: { id }, body: { text } } = req

    try{
        updateNote(id, text)
        .then(() => res.status(204).end())
        .catch(error => {
            if (error instanceof NotFoundError) return res.status(404).json({ message: error.message })
            if (error instanceof ConflictError) return res.status(409).json({ message: error.message })
            res.status(500).json(error.message)
        })
    } catch({error}){
        res.status(400).json(message)
    }
})

api.delete('/note:id', (req,res)=>{
    const { params: { id }} = req

    try {
        deleteNote(id)
        .then(() => res.status(204).end())
        .catch(error => {
            if(error instanceof NotFoundError) return res.status(404).json(error.message)
            if(error instanceof ConflictError) return res.status(409).json(error.message)
            res.status(500).end()
        })
    } catch(error){
        res.status(400).json({message})
    }
})

api.patch('/board:id', (req,res)=>{
    const { params: { id }, body: { name }} = req

    try {
        updateBoard(id, name)
        .then(() => res.status(204).end())
        .catch(error => {
            if(error instanceof NotFoundError) return res.status(404).json(error.message)
            if(error instanceof ConflictError) return res.status(409).json(error.message)
            res.status(500).end()
        })
    } catch(error){
        res.status(400).json({message})
    }
})


database.connect(DB_URL)
    .then(()=> api.listen(PORT, () => console.log(`${name}  ${version} up running on port ${PORT}`)))