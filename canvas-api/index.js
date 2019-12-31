require('dotenv').config()
const express = require('express')
const { name, version } = require('./package.json')
const { env: { PORT, DB_URL } } = process
const cors = require('./utils/cors')
const {createNote, createSection, createBoard, deleteNote, deleteSection,updateBoard, updateNote, retrieveBoard, retrieveSections} = require('./logic')
const { database } = require('canvas-data')
const { errors: { NotFoundError, ConflictError } } = require('canvas-utils')

const bodyparser = require('body-parser')
const jsonBodyParser = bodyparser.json()

const api = express()

api.use(cors)

api.options('*', cors,(req,res)=>{
    res.end()
})

api.get('/board',  (req,res)=>{
    try{
        retrieveBoard()
        .then((board) => res.json(board))
        .catch( error => {
            return res.status(500).json(error)
        })
    } catch({message}){
        res.status(400).json({message})
    }
})

api.get('/sections', jsonBodyParser, (req,res)=>{
    const { body: {boardId} }  = req

    try{
        retrieveSections(boardId)
        .then(sections => res.json(sections))
        .catch( error => {
            if(error instanceof NotFoundError) return res.status(404).json(error.message)
            return res.status(500).json({error})
        })
    } catch({message}){
        res.status(400).json({message})
    }
})

api.post('/section', jsonBodyParser, (req,res)=>{
    const { body: {name, boardId} } = req

    try{
        createSection(boardId, name)
        .then(() => res.status(201).end())
        .catch( error => {
            return res.status(500).json({error})
        })
    } catch({message}){
        res.status(400).json({message})
    }
})

api.post('/board', (req,res)=>{
    try{
        createBoard()
        .then(() => res.status(201).end())
        .catch( error => {
            return res.status(500).json({error})
        })
    } catch({message}){
        res.status(400).json({message})
    }
})

api.delete('/section/:id', (req,res)=>{
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

api.post('/note', jsonBodyParser,(req,res)=>{
    const { body: { text, sectionId } } = req

    try{
        createNote(sectionId,text)
        .then(() => res.status(201).end())
        .catch( error => {
            return res.status(500).json({error})
        })
    } catch({message}){
        res.status(400).json(message)
    }
})

api.put('/note/:noteId', jsonBodyParser, (req,res) => {
    const { params: { noteId }, body: { noteSubject, sectionId } } = req
    debugger
    try{
        updateNote(sectionId, noteId, noteSubject)
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

api.delete('/note/:id', jsonBodyParser, (req,res)=>{
    const { params: { id }, body: { sectionId }} = req

    try {
        deleteNote(sectionId, id)
        .then(() => res.status(204).end())
        .catch(error => {
            if(error instanceof NotFoundError) return res.status(404).json(error.message)
            if(error instanceof ConflictError) return res.status(409).json(error.message)
            res.status(500).end()
        })
    } catch(error){
        res.status(400).json(error.message)
    }
})

api.patch('/board/:boardId', jsonBodyParser, (req,res)=>{
    const { params: { boardId }, body: { boardName }} = req
    debugger
    try {
        updateBoard(boardId, boardName)
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