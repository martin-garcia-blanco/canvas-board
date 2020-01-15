import React, { useState, useEffect } from 'react'
import { Route, withRouter, Redirect } from 'react-router-dom'
import Header from '../Header'
import NewItem from '../New-Item'
import Container from '../Container'
import Feedback from '../Feedback'
import Login from '../Login'
import Register from '../Register'
import {
    retrieveBoard,
    retrieveSections,
    createNote,
    createSection,
    deleteSection,
    deleteNote,
    updateNote,
    updateBoard,
    authentication,
    register,
    
} from '../../logic'
import './index.sass'

export default withRouter(function ({ history }) {

    const [hint, setHint] = useState()
    const [methodSelector, setMethodSelector] = useState()
    const [board, setBoard] = useState()
    const [sections, setSections] = useState([])
    const [render, setRender] = useState(true)
    const [sectionId, setSectionId] = useState(undefined)
    const [noteId, setNoteId] = useState(undefined)
    const [error, setError] = useState(undefined)
    const { token } = sessionStorage

    useEffect(() => {
        (async () => {
            try {
                if (token) {
                    debugger
                    const board = await retrieveBoard(token)
                    sessionStorage.boardId = board.id
                    board && setSections(await retrieveSections(board.id, token))
                    setBoard(board)
                    setError(undefined)
                }
            } catch (error) {
                setError('Connection error, try again later')
            }
        })()
    }, [setBoard, setSections, setError, render])

    const handleAddSection = () => {
        setHint('New section name')
        setMethodSelector('NEW_SECTION')
        history.push('/update')
    }

    const handleChangeBoardName = () => {
        setHint('Board name')
        setMethodSelector('UPDATE_BOARD_NAME')
        history.push('/update')
    }

    const handleAccept = async (text) => {
        switch (methodSelector) {
            case 'NEW_SECTION':
                handleCreateSection(text)
                break
            case 'NEW_NOTE':
                handleCreateNote(sectionId, text)
                break
            case 'UPDATE_NOTE':
                handleUpdateNote(sectionId, noteId, text)
                break
            case 'UPDATE_BOARD_NAME':
                handleUpdateBoardName(board.id, text)
                break
        }
    }

    const handleReject = () => {
        history.push('/')
    }

    const handleUpdateBoardName = async (boardId, boardName) => {
        try {
            await updateBoard(boardId, boardName, token)
            setRender(!render)
            history.push('/')
        } catch (error) {
            setError('Error updating board name, try again later')
        }
    }

    const handleCreateSection = async (sectionName) => {
        try {
            await createSection(board.id, sectionName, token)
            setRender(!render)
            history.push('/')
        } catch (error) {
            setError('Error creating a new section, try again later')
        }
    }

    const handleCreateNote = async (sectionId, noteSubject) => {
        try {
            await createNote(sectionId, noteSubject, token)
            setRender(!render)
            history.push('/')
        } catch (error) {
            setError('Error creating a new note, try again later')
        }
    }

    const handleUpdateNote = async (sectionId, noteId, noteSubject) => {
        try {

            await updateNote(sectionId, noteId, noteSubject, token)
            setRender(!render)
            history.push('/')
        } catch (error) {
            setError('Error updating the note, try again later')
        }
    }

    const handleAddNote = async (sectionId) => {
        setHint('Note subject')
        setMethodSelector('NEW_NOTE')
        setSectionId(sectionId)
        history.push('/update')
    }

    const handleDeleteSection = async (sectionId) => {
        try {
            await deleteSection(sectionId, token)
            setRender(!render)
        } catch (error) {
            setError('Error removing the section, try again later')
        }
    }

    const handleDeleteNote = async (noteId, sectionId) => {
        try {
            await deleteNote(noteId, sectionId, token)
            setRender(!render)
        } catch (error) {
            setError('Error removing the note, try again later')
        }
    }

    const handleModifyNote = async (sectionId, noteId, noteSubject) => {
        setSectionId(sectionId)
        setNoteId(noteId)
        setHint(noteSubject)
        setMethodSelector('UPDATE_NOTE')
        history.push('/update')
    }

    const handleSignUp = async (name, email, password, verification) => {
        try {
            await register(name, email, password, verification)
            history.push('/login')
        } catch (error) {
            debugger
            setError(error)
        }
    }

    const handleLogin = async (email, password) => {
        try {
            sessionStorage.token  = await authentication(email, password)
            history.push('/')
            setRender(!render)
        } catch (error) {
            debugger
            setError(error.message)
        }
    }

    const handleGoLogin = async (e) => {
        history.push('/login')
    }

    const handleGoSignUp = async (e) => {
        history.push('/register')
    }


    return <>
        < Route path='/' render={() => board && token ? <Header onAddSection={handleAddSection} onChangeBoardName={handleChangeBoardName} title={board.name} /> : <Redirect to='login' />} />
        <Route path='/update' render={() => hint && <NewItem hint={hint} onAccept={handleAccept} onReject={handleReject} />} />
        < Route  path='/' render={() => sections && <Container sections={sections} onAddNote={handleAddNote} onDeleteSection={handleDeleteSection} handleModifyNote={handleModifyNote} handleDeleteNote={handleDeleteNote} />} />
        {error && <Feedback text={error} />}

        <Route path='/login' render={() => token ? <Redirect to='/' /> : < Login onGoSignUp={handleGoSignUp} onLogin={handleLogin} />} />
        <Route path='/register' render={() => token ? <Redirect to='/' /> : < Register onGoLogin={handleGoLogin} onSignUp={handleSignUp} />} />
    </>
})