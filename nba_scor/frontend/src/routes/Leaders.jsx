import React from 'react'
import PointsLeaders from '../components/PointsLeaders'
import ReboundLeaders from '../components/ReboundLeaders'
import AssistLeaders from '../components/AssistLeaders'
import './Leaders.css'

export default function Leaders() {
  const [pointsLeaders, setPointsLeaders] = React.useState(null)
  const [reboundLeaders, setReboundLeaders] = React.useState(null)
  const [assistLeaders, setAssistLeaders] = React.useState(null)
  const [loading, setLoading] = React.useState(true)
  const [error, setError] = React.useState(null)

  React.useEffect(() => {
    let mounted = true
    setLoading(true)
    
    // Fetch points, rebounds, and assists leaders
    Promise.all([
      fetch('/api/leaders/points/').then(res => {
        if (!res.ok) throw new Error(res.statusText || 'Network error')
        return res.json()
      }),
      fetch('/api/leaders/rebounds/').then(res => {
        if (!res.ok) throw new Error(res.statusText || 'Network error')
        return res.json()
      }),
      fetch('/api/leaders/assists/').then(res => {
        if (!res.ok) throw new Error(res.statusText || 'Network error')
        return res.json()
      })
    ])
      .then(([pointsData, reboundsData, assistsData]) => {
        if (mounted) {
          setPointsLeaders(pointsData)
          setReboundLeaders(reboundsData)
          setAssistLeaders(assistsData)
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

  if (loading) return <div className="leaders-loading">Loading leaders...</div>
  if (error) return <div className="leaders-error">Error loading leaders: {error}</div>

  return (
    <div className="leaders-page">
      <h1>League Leaders</h1>
      <div className="leaders-content">
        <PointsLeaders leaders={pointsLeaders} />
        <ReboundLeaders leaders={reboundLeaders} />
        <AssistLeaders leaders={assistLeaders} />
      </div>
    </div>
  )
}
