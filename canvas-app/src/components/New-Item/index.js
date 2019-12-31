import React, { useState } from 'react'
import './index.sass'

function NewItem({ onAccept, onReject, hint }) {
    
    const [text, setText] = useState(undefined)

    return <section className="new-section">
        <form className="new-section__header" onSubmit={(event) => event.preventDefault()}>
            <textarea name="new-container" placeholder={hint} value={text || ''} onChange={event => setText(event.target.value)}></textarea>
            <button className="create" onClick={() => onAccept(text)}>
                <i className="material-icons">check_circle</i>
            </button>
            <button className="cancel" onClick={onReject}>
                <i className="material-icons">cancel</i>
            </button>
        </form>
    </section>
}

export default NewItem