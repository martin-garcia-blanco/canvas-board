import React, { useState, useEffect } from 'react'
import { Route, withRouter } from 'react-router-dom'
import Header from '../Header'
import NewItem from '../New-Item'
import Container from '../Container'
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

    useEffect(() => {
        (async () => {
            try {
                const _board = await retrieveBoard()
                setBoard(_board)
                _board && setSections(await retrieveSections(_board.id))
            } catch (error) {
                console.log(error.message)
            }
        })()
    }, [setBoard, render])

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
            console.log(error.message)
        }
    }

    const handleCreateSection = async (sectionName) => {
        try {
            await createSection(board.id, sectionName)
            setRender(!render)
            history.push('/')
        } catch (error) {
            console.log(error.message)
        }
    }

    const handleCreateNote = async (sectionId, noteSubject) => {
        try {
            await createNote(sectionId, noteSubject)
            setRender(!render)
            history.push('/')
        } catch (error) {
            console.log(error.message)
        }
    }

    const  handleUpdateNote = async(sectionId, noteId, noteSubject)=>{
        try {

            await updateNote(sectionId, noteId, noteSubject)
            setRender(!render)
            history.push('/')
        } catch (error) {
            console.log(error.message)
        }
    }

    const handleAddNote = async (sectionId) => {
        try {
            setHint('Note subject')
            setMethodSelector('NEW_NOTE')
            setSectionId(sectionId)
            history.push('/update')
        } catch (error) {
            console.log(error.message)
        }
    }

    const handleDeleteSection = async (sectionId) => {
        try {
            await deleteSection(sectionId)
            setRender(!render)
        } catch (error) {
            console.log(error.message)
        }
    }

    const handleDeleteNote = async (noteId, sectionId) => {
        try {
            await deleteNote(noteId, sectionId)
            setRender(!render)
        } catch (error) {
            console.log(error.message)
        }
    }

    const handleModifyNote = async (sectionId, noteId, noteSubject) => {
        try {
            setSectionId(sectionId)
            setNoteId(noteId)
            setHint(noteSubject)
            setMethodSelector('UPDATE_NOTE')
            history.push('/update')
        } catch (error) {
            console.log(error.message)
        }
    }

    return <>
        { board && <Header onAddSection={handleAddSection} onChangeBoardName={handleChangeBoardName} title={board.name} />}
        <Route path='/update' render={() => hint && <NewItem hint={hint} onAccept={handleAccept} onReject={handleReject} />} />
        {sections && <Container sections={sections} onAddNote={handleAddNote} onDeleteSection={handleDeleteSection} handleModifyNote={handleModifyNote} handleDeleteNote={handleDeleteNote}/>}
    </>
})