import React from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'
import TeamOverview from './TeamOverview'
import TeamAverages from './TeamAverages'
import TeamRoster from './TeamRoster'
import TeamGameLog from './TeamGameLog'
import './TeamPage.css'

export default function TeamPage() {
  const { teamId } = useParams()
  const navigate = useNavigate()
  const { user, token } = useAuth()
  const [team, setTeam] = React.useState(null)
  const [teamStats, setTeamStats] = React.useState(null)
  const [teamAverages, setTeamAverages] = React.useState(null)
  const [teamRoster, setTeamRoster] = React.useState(null)
  const [teamGameLog, setTeamGameLog] = React.useState(null)
  const [loading, setLoading] = React.useState(true)
  const [error, setError] = React.useState(null)
  const [isFavorite, setIsFavorite] = React.useState(false)

  React.useEffect(() => {
    if (user && token && teamId) {
      fetch(`/api/teams/${teamId}/favorite/`, {
        headers: {
          'Authorization': `Token ${token}`
        }
      })
        .then(res => {
          if (res.ok) return res.json()
          throw new Error('Failed to fetch favorite status')
        })
        .then(data => setIsFavorite(data.is_favorite))
        .catch(console.error)
    }
  }, [user, token, teamId])

  const toggleFavorite = async () => {
    if (!user) {
      navigate('/login')
      return
    }

    try {
      const res = await fetch(`/api/teams/${teamId}/favorite/`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Token ${token}`
        },
        body: JSON.stringify({
          team_name: team.full_name,
          team_abbreviation: team.abbreviation
        })
      })

      if (res.ok) {
        const data = await res.json()
        setIsFavorite(data.is_favorite)
      }
    } catch (err) {
      console.error('Error toggling favorite:', err)
    }
  }

  React.useEffect(() => {
    let mounted = true
    setLoading(true)
    
    // Fetch all team data in parallel
    Promise.all([
      fetch(`/api/teams/`).then(res => {
        if (!res.ok) throw new Error(res.statusText || 'Network error')
        return res.json()
      }),
      fetch(`/api/teams/${teamId}/stats/`).then(res => {
        if (!res.ok) throw new Error(res.statusText || 'Network error')
        return res.json()
      }),
      fetch(`/api/teams/${teamId}/averages/`).then(res => {
        if (!res.ok) throw new Error(res.statusText || 'Network error')
        return res.json()
      }),
      fetch(`/api/teams/${teamId}/roster/`).then(res => {
        if (!res.ok) throw new Error(res.statusText || 'Network error')
        return res.json()
      }),
      fetch(`/api/teams/${teamId}/gamelog/`).then(res => {
        if (!res.ok) throw new Error(res.statusText || 'Network error')
        return res.json()
      })
    ])
      .then(([teamsData, statsData, averagesData, rosterData, gameLogData]) => {
        if (mounted) {
          const foundTeam = teamsData.find(t => t.id === parseInt(teamId))
          setTeam(foundTeam)
          setTeamStats(statsData)
          setTeamAverages(averagesData)
          setTeamRoster(rosterData)
          setTeamGameLog(gameLogData)
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
  }, [teamId])

  if (loading) return <div>Loading team...</div>
  if (error) return <div>Error loading team: {error}</div>
  if (!team) return <div>Team not found</div>

  const logoAbbreviations = {
    'NOP': 'NO',
    'UTA': 'utah'
  }
  const logoAbbr = logoAbbreviations[team.abbreviation] || team.abbreviation
  const logoUrl = `https://cdn.nba.com/logos/nba/${logoAbbr}/primary/L/logo.svg`

  return (
    <div className='teams-team-page'>
      <img 
        src={logoUrl} 
        alt={`${team.full_name} logo`}
        style={{ width: '200px', height: '200px' }}
        onError={(e) => {
          const espnAbbr = logoAbbreviations[team.abbreviation] || team.abbreviation.toLowerCase()
          e.target.src = `https://a.espncdn.com/i/teamlogos/nba/500/${espnAbbr}.png`
        }}
      />
      <div className="team-header">
        <h1>{team.full_name}</h1>
        <button 
          className="favorite-btn"
          onClick={toggleFavorite}
          title={isFavorite ? "Remove from favorites" : "Add to favorites"}
        >
          {isFavorite ? "★" : "☆"}
        </button>
      </div>
      <div className='team-stats-row'>
        <TeamOverview stats={teamStats} />
        <TeamAverages averages={teamAverages} />
      </div>
      <div className='team-stats-row'>
        <TeamRoster roster={teamRoster} />
        <TeamGameLog gameLog={teamGameLog} teamId={teamId} />
      </div>
    </div>
  )
}
