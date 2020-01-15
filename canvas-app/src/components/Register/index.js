import React, { useState } from 'react'
import './index.sass'

function Register({onSignUp, onGoLogin}) {
    const [name, setName] = useState(undefined)
    const [email, setEmail] = useState(undefined)
    const [password, setPassword] = useState(undefined)
    const [verification, setVerification] = useState(undefined)

    return <section className="register">
        <header className="header">
        </header>

        <h2 className="register__h2">Register</h2>
        <form className="register__form form" onSubmit={(event)=>{ event.preventDefault()}}>
            <input type="text" className="input form__name" value={name || ''} onChange={e => setName(e.target.value)} name="name" placeholder="name" />
            <input className="input form__email" type="email" value={email || ''} name="email" onChange={e => setEmail(e.target.value)} placeholder="mail@123.com" />
            <input className="input form__password" type="password" value={password || ''} onChange={e => setPassword(e.target.value)} name="password" placeholder="password" />
            <input className="input form__password" type="password" value={verification || ''} onChange={e => setVerification(e.target.value)} name="password-verification" placeholder="password verification" />
            <div>
                <button className="button form__register" onClick={onGoLogin}>LogIn</button>
                <button className="button form__signup" onClick={() => onSignUp(name, email, password, verification)}>SignUp</button>
            </div>
        </form>
    </section>
}

export default Register