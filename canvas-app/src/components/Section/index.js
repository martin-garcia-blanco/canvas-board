import React from 'react'
import './index.sass'
import Note from '../Note'

function Section({notes}) {

    return <section class="section">
        <header class="section__header">
            <h2>CUSTOMER SEGMENTS</h2>
            <i class="material-icons">remove_circle</i>
        </header>
        <ul class="section__list notes">
            {notes && notes.map(note => <li><Note/></li>)}
        </ul>
        <form class="section__form form">
            <button class="form__button">
                <i class="material-icons">add_circle</i>
            </button>
        </form>
    </section>
}

export default Section