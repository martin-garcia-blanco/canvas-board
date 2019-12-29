import React from 'react'
import './index.sass'

function NewItem({ onAccept, onReject, hint }) {

    return <section className="new-section">
        <form className="new-section__header" onSubmit={(event) => event.preventDefault()}>
            <textarea name="new-container" placeholder={hint}></textarea>
            <button className="create" onClick={onAccept}>
                <i className="material-icons">check_circle</i>
            </button>
            <button className="cancel" onClick={onReject}>
                <i className="material-icons">cancel</i>
            </button>
        </form>
    </section>
}

export default NewItem