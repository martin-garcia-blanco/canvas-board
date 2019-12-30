import React from 'react'
import './index.sass'
import Section from '../Section'

function Container({sections}){

    return <main className="main">
        <ul>
            {sections.map(section => <li><Section/></li>)}
        </ul>
    </main>
}

export default Container