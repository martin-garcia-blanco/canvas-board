require('dotenv').config()
const express = require('express')
const { name, version } = require('./package.json')
const { env: { PORT, TEST_DB_URL, SECRET } } = process
const cors = require('./utils/cors')
const {createNote, createSection, createBoard, register, authentication, deleteNote, deleteSection,updateBoard, updateNote, retrieveBoard, retrieveSections} = require('./logic')
const { database } = require('canvas-data')
const { errors: { NotFoundError, ConflictError, CredentialsError } } = require('canvas-utils')
const tokenVerifier = require('./helpers/token-verifier')(SECRET)
const bodyparser = require('body-parser')
const jsonBodyParser = bodyparser.json()
const jwt = require('jsonwebtoken')
const api = express()

api.use(cors)

api.options('*', cors,(req,res)=>{
    res.end()
})

api.get('/board', tokenVerifier, (req,res)=>{
    const { id } = req
    try{
        retrieveBoard(id)
        .then((board) => res.json(board))
        .catch( error => {
            return res.status(500).json(error)
        })
    } catch(error){
        res.status(400).json(error.message)
    }
})

api.get('/sections/:boardId', tokenVerifier, jsonBodyParser, (req,res)=>{
    debugger
    const { params: { boardId } }  = req

    try{
        retrieveSections(boardId)
        .then(sections => res.json(sections))
        .catch( error => {
            if(error instanceof NotFoundError) return res.status(404).json(error.message)
            return res.status(500).json({error})
        })
    } catch(error){
        res.status(400).json(error.message)
    }
})

api.post('/section', jsonBodyParser, tokenVerifier, (req,res)=>{
    const { body: {name, boardId} } = req

    try{
        createSection(boardId, name)
        .then(() => res.status(201).end())
        .catch( error => {
            return res.status(500).json(error.message)
        })
    } catch(error){
        res.status(400).json(error.message)
    }
})

api.post('/board', (req,res)=>{
    try{
        createBoard()
        .then(() => res.status(201).end())
        .catch( error => {
            return res.status(500).json(error.message)
        })
    } catch(error){
        res.status(400).json(error.message)
    }
})

api.delete('/section/:id', tokenVerifier, (req,res)=>{
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

api.post('/note', jsonBodyParser, tokenVerifier, (req,res)=>{
    const { body: { text, sectionId } } = req

    try{
        createNote(sectionId,text)
        .then(() => res.status(201).end())
        .catch( error => {
            return res.status(500).json(error.message)
        })
    } catch(error){
        res.status(400).json(error.message)
    }
})

api.put('/note/:noteId', jsonBodyParser, tokenVerifier,  (req,res) => {
    const { params: { noteId }, body: { noteSubject, sectionId } } = req
    debugger
    try{
        updateNote(sectionId, noteId, noteSubject)
        .then(() => res.status(204).end())
        .catch(error => {
            if (error instanceof NotFoundError) return res.status(404).json( error.message )
            if (error instanceof ConflictError) return res.status(409).json( error.message )
            res.status(500).json(error.message)
        })
    } catch(error){
        res.status(400).json(error.message)
    }
})

api.delete('/note/:id', jsonBodyParser, tokenVerifier, (req,res)=>{
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

api.patch('/board/:boardId', jsonBodyParser, tokenVerifier, (req,res)=>{
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
        res.status(400).json(message)
    }
})

api.post('/', jsonBodyParser, (req,res) => {
    try{
        const { body: {name, email, password} } = req
        
        register(name, email, password)
        .then(() => res.status(201).end())
        .catch(error => {
            const { message } = error

            if(error instanceof ConflictError) 
                return res.status(409).json(message)
            res.status(500).json(message)
        })
    } catch(error){
        res.status(400).json(error.message)
    }
})

api.post('/auth', jsonBodyParser, (req, res) => {
    
    const { body: { email, password } } = req

    try {
        authentication(email, password)
            .then(id => {
                const token = jwt.sign({ sub: id }, SECRET, { expiresIn: '1d' })

                res.json({ token })
            })
            .catch(error => {
                const { message } = error

                if (error instanceof CredentialsError)
                    return res.status(401).json( message )

                res.status(500).json( message )
            })
    } catch ({ message }) {
        res.status(400).json( message )
    }
})


database.connect(TEST_DB_URL)
    .then(()=> api.listen(PORT, () => console.log(`${name}  ${version} up running on port ${PORT}`)))