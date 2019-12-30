import React, { useState, useEffect }  from 'react'
import { Route, withRouter } from 'react-router-dom'
import Header from '../Header'
import NewItem from '../New-Item'
import Container from '../Container'
import {retrieveBoard, createBoard} from '../../logic'
import './index.sass'

export default withRouter(function ({history}) {

    const [hint, setHint] = useState()
    const [methodSelector, setMethodSelector] = useState()
    const [board, setBoard] = useState()
    const [sections, setSections] = useState([])
    const [render, setRender] = useState(true)


    useEffect(() =>{
        (async()=>{
            await boardSetter()
            debugger
            board && setSections(board.sections) && console.log(sections)
        })()
    }, [setBoard, setRender])

    const boardSetter = async() => {
        try{
            const _board = await retrieveBoard()
            setBoard(_board)
            setRender(!render)
        } catch(error){
            if(error.name === 'NotFoundError'){
                try{
                    await createBoard()
                    setBoard(await retrieveBoard())
                }catch(error){
                    console.log(error.message)
                }
            }
        }
    }

    const handleAddSection = () => {
        setHint('New section name')
        setMethodSelector('newSection')
        history.push('/update')
    }

    const handleChangeBoardName = () => {
        setHint('Board name')
        setMethodSelector('updateBoardName')
        history.push('/update')
    }

    const handleAccept = () => {
        console.log('handleAccept')
    }

    const handleReject = () => {
        console.log('handleReject')
    }

    return <>
    <Header onAddSection={handleAddSection} onChangeBoardName={handleChangeBoardName}/>
    <Route path='/update' render={()=> hint && <NewItem hint={hint} onAccept={handleAccept} onReject={handleReject}/>} />
    {sections && <Container sections={sections}/>}
    </>
})