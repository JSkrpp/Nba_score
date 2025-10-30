import React from 'react'
import PlayerCard from '../components/PlayerCard.jsx'
import { Link } from 'react-router-dom'
import './Players.css'

export default function Players() {
  const [players, setPlayers] = React.useState(null)
  const [loading, setLoading] = React.useState(true)
  const [error, setError] = React.useState(null)
  const [searchQuery, setSearchQuery] = React.useState('')

  React.useEffect(() => {
    let mounted = true
    setLoading(true)
    fetch('/api/players/')
      .then((res) => {
        if (!res.ok) throw new Error(res.statusText || 'Network error')
        return res.json()
      })
      .then((data) => {
        if (mounted) {
          setPlayers(data)
          setError(null)
        }
      })
      .catch((err) => {
        if (mounted) setError(err.message || String(err))
      })
      .finally(() => {
        if (mounted) setLoading(false)
      })

    return () => {
      mounted = false
    }
  }, [])

  if (loading) return <div>Loading players...</div>
  if (error) return <div>Error loading players: {error}</div>

  return (
    <div className="players-container">
      <div className="players-header">
        <h2>Players</h2>
        <div className="search-bar">
          <input
            type="text"
            placeholder="Search for a player"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>
      </div>
      <div className="players-data">
        {players
          ?.filter((player) =>
            `${player.first_name} ${player.last_name}`
              .toLowerCase()
              .includes(searchQuery.toLowerCase())
          )
          .map((player) => (
            <Link
              to={`/players/${player.id}`}
              key={player.id}
              style={{ textDecoration: 'none', color: 'inherit' }}
            >
              <PlayerCard
                lastName={player.last_name}
                firstName={player.first_name}
              />
            </Link>
          ))}
      </div>
    </div>
  )
}