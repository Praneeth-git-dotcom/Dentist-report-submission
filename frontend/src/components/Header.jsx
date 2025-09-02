import React from 'react'
import { NavLink, useNavigate } from 'react-router-dom'


export default function Header(){
const nav = useNavigate()
const logout = () => { localStorage.removeItem('token'); nav('/') }
return (
<div className="header">
<div>
<strong>OralVis</strong>
</div>
<nav>
<NavLink to="/" end>Login</NavLink>
<NavLink to="/technician">Technician</NavLink>
<NavLink to="/dentist">Dentist</NavLink>
</nav>
<button className="btn secondary" onClick={logout}>Logout</button>
</div>
)
}