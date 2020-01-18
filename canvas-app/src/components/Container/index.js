import React from 'react'
import './index.sass'
import Section from '../Section'

function Container({sections, onAddNote, onDeleteSection, handleModifyNote, handleDeleteNote}){
    return <main className="main">
        <ul>
            {sections && sections.length>0 ? sections.map((section, index) => <li key={index}><Section section={section}  onAddNote={onAddNote} onDeleteSection={onDeleteSection} handleModifyNote={handleModifyNote} handleDeleteNote={handleDeleteNote}/></li>) : <h2 className='add' >Create your first note  <i class="material-icons">
arrow_upward
</i></h2>}
        </ul>
    </main>
}

export default Container