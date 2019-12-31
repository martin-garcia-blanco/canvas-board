import React from 'react'
import './index.sass'

function Feedback({ text }) {

    return <section className="feedback">
        <p className="feedback__text">{text}</p>
    </section>
}

export default Feedback