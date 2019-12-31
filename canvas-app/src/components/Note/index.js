import React, { useState } from 'react'
import './index.sass'

function Note({note:{id, text}, onDelete, onModify, sectionId}) {
return <div className="note">
        <div className="note__form note-form">
            <button className="note-form__modify" onClick={()=> onModify(sectionId, id, text)}><i className="material-icons">create</i></button>
            <button className="note-form__delete" onClick={()=> onDelete(id,sectionId, )}><i className="material-icons">delete</i></button>
            <textarea className="note-form__text" type="text" value={text} disabled></textarea>
        </div>
    </div>
}

export default Note