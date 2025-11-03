import React from 'react'
import './Navbar.css'
import { Link, Routes, Route } from 'react-router-dom'
import logo from '../assets/logo.webp'
import Teams from '../routes/Teams'
import Players from '../routes/Players'
import PlayerStats from '../routes/PlayerStats'
import Leaders from '../routes/Leaders'

function Home() {
  return (
    <div>
      <h1 style={{ fontFamily: 'system-ui, Arial, sans-serif', color: '#222' }}>Welcome</h1>
    </div>
  )
}

function Live() {
  return <h2>Live scores will appear here</h2>
}

/* Teams component moved to src/routes/Teams.jsx */

function Games() {
  return <h2>Games and boxscores</h2>
}

function Standings() {
    return <h2>Team Standings</h2>
}  

export default function Navbar() {
  return (
    <>
      <nav className="navbar">
        <div className="navbar-brand">
          <Link to="/" className="navbar-logo">
            <img src={logo} alt="NBA Scores" className="logo-image" />
          </Link>
        </div>
        <div className="navbar-links">
          <Link to="/live" className="nav-link">🔴 Live</Link>
          <Link to="/players" className="nav-link">Players</Link>
          <Link to="/teams" className="nav-link">Teams</Link>
          <Link to="/leaders" className="nav-link">Leaders</Link>
          <Link to="/standings" className="nav-link">Standings</Link>
        </div>
        <div className="navbar-spacer"></div>
      </nav>

      <main className="main-content">
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/live" element={<Live />} />
          <Route path="/players" element={<Players />} />
          <Route path="/players/:playerId" element={<PlayerStats />} />
          <Route path="/teams" element={<Teams />} />
          <Route path="/leaders" element={<Leaders />} />
          <Route path="/standings" element={<Standings />} />
        </Routes>
      </main>
    </>
  )
}