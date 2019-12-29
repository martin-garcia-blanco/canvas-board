import React from 'react'
import './index.sass'

function Feedback({ text }) {

    return <section class="feedback">
        <p class="feedback__text">{text}</p>
    </section>
}

export default Feedback