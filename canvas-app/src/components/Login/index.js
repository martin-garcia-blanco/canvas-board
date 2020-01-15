import React, { useState } from 'react'
import './index.sass'

function Login({onLogin, onGoSignUp}) {
    const [email,setEmail] = useState(undefined)
    const [password, setPassword] = useState(undefined)

    return <section className="login">
        <header className="header">
        </header>

        <h2 className="login__h2">Login</h2>
        <form className="login__form form" onSubmit={(event)=> event.preventDefault()}>
            <input className="input form__email" type="email" value={email || ''} onChange={e => setEmail(e.target.value)} name="email" placeholder="mail@hola.com" />
            <input className="input form__password" type="password" name="password" value={password || ''} onChange={e => setPassword(e.target.value)} placeholder="***" />
            <div>
                <button className="button form__login" onClick={()=> onLogin(email,password)}>LogIn</button>
                <button className="button form__signup" onClick={onGoSignUp}>SignUp</button>
            </div>
        </form>
    </section>
}

export default Login