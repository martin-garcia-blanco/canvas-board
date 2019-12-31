import React from 'react'
import './index.sass'
import Section from '../Section'

function Container({sections, onAddNote, onDeleteSection, handleModifyNote, handleDeleteNote}){
    return <main className="main">
        <ul>
            {sections && sections.map((section, index) => <li key={index}><Section section={section}  onAddNote={onAddNote} onDeleteSection={onDeleteSection} handleModifyNote={handleModifyNote} handleDeleteNote={handleDeleteNote}/></li>)}
        </ul>
    </main>
}

export default Container