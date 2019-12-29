import React, { useState }  from 'react'
import { Route, withRouter, Redirect } from 'react-router-dom'
import Header from '../Header'
import NewItem from '../New-Item'
import './index.sass'

export default withRouter(function ({history}) {

    const [hint, setHint] = useState()
    const [methodSelector, setMethodSelector] = useState()

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
    </>
})