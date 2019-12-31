import React from 'react'
import './index.sass'
import Note from '../Note'

function Section({section:{id,name,notes}, onAddNote, onDeleteSection, handleDeleteNote, handleModifyNote}) {
    return <section className="section">
        <header className="section__header">
            <h2>{name}</h2>
            <button className="form__button" onClick={()=> onDeleteSection(id)}><i className="material-icons">remove_circle</i></button>
        </header>
        <ul className="section__list notes">
        {notes && notes.map((note, index) => <li key={index}><Note note={note} sectionId={id} onDelete={handleDeleteNote} onModify={handleModifyNote}/></li>)}
        </ul>   
            <button className="form__button" onClick={()=>onAddNote(id)}>
                <i className="material-icons">add_circle</i>
            </button>
    </section>
}

export default Section