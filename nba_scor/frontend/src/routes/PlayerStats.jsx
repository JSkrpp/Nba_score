import React from 'react'
import { useParams } from 'react-router-dom'
import './PlayerStats.css'

export default function PlayerStats() {
  const { playerId } = useParams()
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
        
        if (data.player_info && data.headers) {
          const headers = data.headers
          const row = data.player_info
          const nameIndex = headers.indexOf('DISPLAY_FIRST_LAST')
          if (nameIndex !== -1) {
            setPlayerName(row[nameIndex])
          } else {
            const fIdx = headers.indexOf('FIRST_NAME')
            const lIdx = headers.indexOf('LAST_NAME')
            if (fIdx !== -1 && lIdx !== -1) setPlayerName(`${row[fIdx]} ${row[lIdx]}`)
            else setPlayerName('Unknown Player')
          }
        } else if (data.player_info && typeof data.player_info === 'object') {

          setPlayerName(data.player_info.display_first_last || data.player_info.first_name + ' ' + data.player_info.last_name || 'Unknown Player')
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
    <div>
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
