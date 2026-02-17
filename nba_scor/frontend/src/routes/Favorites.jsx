import React, { useEffect, useState } from 'react'
import { useAuth } from '../context/AuthContext'
import { useNavigate, Link } from 'react-router-dom'
import PlayerCard from '../components/PlayerCard'
import TeamCard from '../components/TeamCard'
import './Favorites.css'

export default function Favorites() {
  const { user, token } = useAuth()
  const navigate = useNavigate()
  const [favorites, setFavorites] = useState({ players: [], teams: [] })
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    if (!user) {
      navigate('/login')
      return
    }

    fetch('/api/user/favorites/', {
      headers: {
        'Authorization': `Token ${token}`
      }
    })
      .then(res => {
        if (!res.ok) throw new Error('Failed to fetch favorites')
        return res.json()
      })
      .then(data => {
        setFavorites(data)
        setLoading(false)
      })
      .catch(err => {
        console.error(err)
        setLoading(false)
      })
  }, [user, token, navigate])

  if (loading) return <div>Loading favorites...</div>

  return (
    <div className="favorites-container">
      <h1>My Favorites</h1>
      <div className="favorites-grid">
        <div className="favorites-column">
          <h2>Favorite Players</h2>
          <div className="favorites-list">
            {favorites.players.length > 0 ? (
              favorites.players.map(player => (
                <Link to={`/players/${player.id}`} key={player.id} style={{ textDecoration: 'none' }}>
                    <PlayerCard 
                      firstName={player.firstName} 
                      lastName={player.lastName} 
                    />
                </Link>
              ))
            ) : (
              <p>No favorite players yet.</p>
            )}
          </div>
        </div>
        <div className="favorites-column">
          <h2>Favorite Teams</h2>
          <div className="favorites-list">
            {favorites.teams.length > 0 ? (
              favorites.teams.map(team => (
                <TeamCard 
                  key={team.id}
                  name={team.name}
                  abbreviation={team.abbreviation}
                  teamId={team.id}
                />
              ))
            ) : (
              <p>No favorite teams yet.</p>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}
