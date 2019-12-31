import React from 'react'
import './index.sass'

function Header({ title, onChangeBoardName, onAddSection }) {
    return <section className="header">
        <h1 className="header__title">{title}</h1>
        <form className="header__form form" onSubmit={(event) => event.preventDefault()}>
            <button className="form__button" onClick={onChangeBoardName}>
                <i className="material-icons" id="icon--white">create</i>
            </button>
            <button className="form__button" onClick={onAddSection}>
                <i className="material-icons" id="icon--white">add_circle</i>
            </button>
        </form>
    </section>
}

export default Header