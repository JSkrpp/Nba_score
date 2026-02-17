import React from 'react'
import './TeamAverages.css'

export default function TeamAverages({ averages }) {
  if (!averages) return null

  return (
    <div className="team-averages">
      <h2>Team Averages Per Game</h2>
      <div className="averages-grid">
        <div className="average-stat-item">
          <div className="average-stat-value">{averages.points.toFixed(1)}</div>
          <div className="average-stat-label">Points</div>
        </div>
        <div className="average-stat-item">
          <div className="average-stat-value">{averages.total_rebounds.toFixed(1)}</div>
          <div className="average-stat-label">Rebounds</div>
        </div>
        <div className="average-stat-item">
          <div className="average-stat-value">{averages.assists.toFixed(1)}</div>
          <div className="average-stat-label">Assists</div>
        </div>
        <div className="average-stat-item">
          <div className="average-stat-value">{averages.steals.toFixed(1)}</div>
          <div className="average-stat-label">Steals</div>
        </div>
        <div className="average-stat-item">
          <div className="average-stat-value">{averages.blocks.toFixed(1)}</div>
          <div className="average-stat-label">Blocks</div>
        </div>
        <div className="average-stat-item">
          <div className="average-stat-value">{averages.turnovers.toFixed(1)}</div>
          <div className="average-stat-label">Turnovers</div>
        </div>
      </div>
      
      <div className="shooting-averages">
        <h3>Shooting Percentages</h3>
        <div className="shooting-grid">
          <div className="shooting-stat-item">
            <div className="shooting-stat-value">{(averages.field_goal_pct * 100).toFixed(1)}%</div>
            <div className="shooting-stat-label">FG%</div>
          </div>
          <div className="shooting-stat-item">
            <div className="shooting-stat-value">{(averages.three_point_pct * 100).toFixed(1)}%</div>
            <div className="shooting-stat-label">3P%</div>
          </div>
          <div className="shooting-stat-item">
            <div className="shooting-stat-value">{(averages.free_throw_pct * 100).toFixed(1)}%</div>
            <div className="shooting-stat-label">FT%</div>
          </div>
        </div>
      </div>
    </div>
  )
}
