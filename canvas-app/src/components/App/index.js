import React, { useState, useEffect } from 'react'
import { Route, withRouter } from 'react-router-dom'
import Header from '../Header'
import NewItem from '../New-Item'
import Container from '../Container'
import Feedback from '../Feedback'
import {
    retrieveBoard,
    retrieveSections,
    createNote,
    createSection,
    deleteSection,
    deleteNote,
    updateNote,
    updateBoard
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


    useEffect(() => {
        (async () => {
            try {
                const _board = await retrieveBoard()
                setBoard(_board)
                _board && setSections(await retrieveSections(_board.id))
                setError(undefined)
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
            await updateBoard(boardId, boardName)
            setRender(!render)
            history.push('/')
        } catch (error) {
            setError('Error updating board name, try again later')
        }
    }

    const handleCreateSection = async (sectionName) => {
        try {
            await createSection(board.id, sectionName)
            setRender(!render)
            history.push('/')
        } catch (error) {
            setError('Error creating a new section, try again later')
        }
    }

    const handleCreateNote = async (sectionId, noteSubject) => {
        try {
            await createNote(sectionId, noteSubject)
            setRender(!render)
            history.push('/')
        } catch (error) {
            setError('Error creating a new note, try again later')
        }
    }

    const handleUpdateNote = async (sectionId, noteId, noteSubject) => {
        try {

            await updateNote(sectionId, noteId, noteSubject)
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
            await deleteSection(sectionId)
            setRender(!render)
        } catch (error) {
            setError('Error removing the section, try again later')
        }
    }

    const handleDeleteNote = async (noteId, sectionId) => {
        try {
            await deleteNote(noteId, sectionId)
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

    return <>
        {board && <Header onAddSection={handleAddSection} onChangeBoardName={handleChangeBoardName} title={board.name} />}
        <Route path='/update' render={() => hint && <NewItem hint={hint} onAccept={handleAccept} onReject={handleReject} />} />
        {sections && <Container sections={sections} onAddNote={handleAddNote} onDeleteSection={handleDeleteSection} handleModifyNote={handleModifyNote} handleDeleteNote={handleDeleteNote} />}
        {error && <Feedback text={error} />}
    </>
})