import React from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import './PlayerStats.css'

export default function PlayerStats() {
  const { playerId } = useParams()
  const navigate = useNavigate()
  const [loading, setLoading] = React.useState(true)
  const [error, setError] = React.useState(null)
  const [playerName, setPlayerName] = React.useState('')
  const [photoUrl, setPhotoUrl] = React.useState('')

  React.useEffect(() => {
    let mounted = true
    setLoading(true)
    fetch(`/api/players/${playerId}/`)
      .then((res) => {
        if (!res.ok) throw new Error(res.statusText || 'Network error')
        return res.json()
      })
      .then((data) => {
        if (!mounted) return
        
        // The backend returns player_info as an object with full_name, first_name, last_name, etc.
        if (data.player_info) {
          const info = data.player_info
          // Try full_name first, then construct from first_name + last_name
          const name = info.full_name || `${info.first_name || ''} ${info.last_name || ''}`.trim() || 'Unknown Player'
          setPlayerName(name)
        } else {
          setPlayerName('Unknown Player')
        }

        setPhotoUrl('https://cdn.nba.com/headshots/nba/latest/1040x760/' + playerId + '.png')
        setError(null)
      })
      .catch((err) => {
        setError(err.message || String(err))
      })
      .finally(() => {
        if (mounted) setLoading(false)
      })

    return () => {
      mounted = false
    }
  }, [playerId])

  if (loading) return <div>Loading player...</div>
  if (error) return <div>Error loading player: {error}</div>

  return (
    <div className="player-stats-container">
      <button 
        onClick={() => navigate('/players')}
        className="back-button"
        aria-label="Back to players"
      >
        ← Back to Players
      </button>
      {photoUrl && (
        <div className="player-photo-container">
          <img src={photoUrl} alt={playerName} className="player-photo" />
        </div>
      )}
      <h2>{playerName}</h2>
      <p>Player ID: {playerId}</p>
    </div>
  )
}
