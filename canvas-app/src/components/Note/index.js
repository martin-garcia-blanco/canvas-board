import React from 'react'
import './index.sass'

function Note() {

    return <div class="note">
        <form class="note__form note-form">
            <button class="note-form__modify"><i class="material-icons">create</i></button>
            <button class="note-form__delete"><i class="material-icons">delete</i></button>
            <textarea class="note-form__text" type="text">textarea textarea textarea textareas</textarea>
        </form>
    </div>
}

export default Note