import React from 'react'
import { useNavigate } from 'react-router-dom'
import './GameByGame.css'

export default function GameByGame({ playerId }) {
  const navigate = useNavigate()
  const [gameLog, setGameLog] = React.useState([])
  const [loading, setLoading] = React.useState(true)
  const [error, setError] = React.useState(null)

  React.useEffect(() => {
    if (!playerId) return

    setLoading(true)
    fetch(`/api/players/${playerId}/gamelog/`)
      .then(res => {
        if (!res.ok) throw new Error(res.statusText || 'Network error')
        return res.json()
      })
      .then((data) => {
        setGameLog(data)
        setError(null)
        setLoading(false)
      })
      .catch((err) => {
        setError(err.message || String(err))
        setLoading(false)
      })
  }, [playerId])

  const formatDate = (dateStr) => {
    if (!dateStr) return '-'
    const date = new Date(dateStr)
    return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' })
  }

  const formatMatchup = (matchup) => {
    if (!matchup) return '-'
    return matchup.replace(/\s+/g, ' ')
  }

  const handleGameClick = (gameId) => {
    if (gameId) {
      navigate(`/games/${gameId}`)
    }
  }

  if (loading) return <div className="gamelog-loading">Loading game log...</div>
  if (error) return <div className="gamelog-error">Error loading game log: {error}</div>
  if (!gameLog || gameLog.length === 0) return <div className="gamelog-empty">No games found</div>

  const handleExportCSV = () => {
    window.location.href = `/api/players/${playerId}/gamelog/export/`
  }

  return (
    <div className="game-by-game">
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <h3>Game by Game Log</h3>
        <button onClick={handleExportCSV} className="export-csv-btn">
          Export to CSV
        </button>
      </div>
      <div className="gamelog-table-container">
        <table className="gamelog-table">
          <thead>
            <tr>
              <th title="Date">Date</th>
              <th title="Matchup">Matchup</th>
              <th title="Win/Loss">WL</th>
              <th title="Minutes Played">MIN</th>
              <th title="Points">PTS</th>
              <th title="Rebounds">REB</th>
              <th title="Assists">AST</th>
              <th title="Steals">STL</th>
              <th title="Blocks">BLK</th>
              <th title="Field Goals Made/Attempted">FG</th>
              <th title="Field Goal Percentage">FG%</th>
              <th title="3-Point Field Goals Made/Attempted">3PT</th>
              <th title="3-Point Field Goal Percentage">3P%</th>
              <th title="Free Throws Made/Attempted">FT</th>
              <th title="Free Throw Percentage">FT%</th>
              <th title="Turnovers">TO</th>
              <th title="Plus/Minus">+/-</th>
            </tr>
          </thead>
          <tbody>
            {gameLog.map((game, index) => (
              <tr 
                key={index} 
                className={`${game.WL === 'W' ? 'win' : 'loss'} clickable`}
                onClick={() => handleGameClick(game.Game_ID)}
              >
                <td>{formatDate(game.GAME_DATE)}</td>
                <td className="matchup">{formatMatchup(game.MATCHUP)}</td>
                <td className={`wl ${game.WL === 'W' ? 'win-text' : 'loss-text'}`}>{game.WL || '-'}</td>
                <td>{game.MIN || '0'}</td>
                <td className="pts">{game.PTS || 0}</td>
                <td>{game.REB || 0}</td>
                <td>{game.AST || 0}</td>
                <td>{game.STL || 0}</td>
                <td>{game.BLK || 0}</td>
                <td>{game.FGM || 0}/{game.FGA || 0}</td>
                <td>{game.FG_PCT ? (game.FG_PCT * 100).toFixed(1) + '%' : '-'}</td>
                <td>{game.FG3M || 0}/{game.FG3A || 0}</td>
                <td>{game.FG3_PCT ? (game.FG3_PCT * 100).toFixed(1) + '%' : '-'}</td>
                <td>{game.FTM || 0}/{game.FTA || 0}</td>
                <td>{game.FT_PCT ? (game.FT_PCT * 100).toFixed(1) + '%' : '-'}</td>
                <td>{game.TOV || 0}</td>
                <td className={game.PLUS_MINUS >= 0 ? 'plus' : 'minus'}>
                  {game.PLUS_MINUS > 0 ? '+' : ''}{game.PLUS_MINUS || 0}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  )
}
