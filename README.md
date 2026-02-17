# NBA Score

A full-stack web application for tracking NBA games, scores, player statistics, and team information in real-time.

## Features

- **Live Scores** - Real-time game scores and updates during live NBA games
- **Game Schedule** - Browse games by date with detailed box scores
- **Player Stats** - Search players, view career statistics, and game-by-game logs
- **Team Information** - Team rosters, averages, and game logs
- **League Leaders** - Top performers in points, rebounds, assists, blocks, steals, and field goals
- **Standings** - Current NBA conference and division standings
- **User Authentication** - Register and login to save your favorites
- **Favorites** - Save your favorite teams and players for quick access
- **CSV Export** - Export player and team game logs to CSV

## Tech Stack

### Backend
- **Django 5.2** - Python web framework
- **Django REST Framework** - RESTful API
- **SQLite** - Database
- **nba_api** - Official NBA stats API wrapper

### Frontend
- **React 19** - UI library
- **Vite 7** - Build tool and dev server
- **React Router 7** - Client-side routing

## Prerequisites

- Python 3.10+
- Node.js 18+
- npm or yarn

## Installation

### 1. Clone the repository

```bash
git clone https://github.com/JSkrpp/Nba_score.git
cd Nba_score
```

### 2. Backend Setup

```bash
cd nba_scor

# Create virtual environment
python -m venv venv

# Activate virtual environment
# Windows:
venv\Scripts\activate
# macOS/Linux:
source venv/bin/activate

# Install dependencies
pip install django djangorestframework nba_api pandas

# Run migrations
python manage.py migrate

# (Optional) Import NBA data
python manage.py import_nba_data

# Start the Django server
python manage.py runserver
```

### 3. Frontend Setup

```bash
cd nba_scor/frontend

# Install dependencies
npm install

# Start the development server
npm run dev
```

### 4. Access the Application

- **Frontend**: http://localhost:5173
- **Backend API**: http://localhost:8000/api/

## API Endpoints

### Authentication
| Method | Endpoint | Description |
|--------|----------|-------------|
| POST | `/api/auth/register/` | Register a new user |
| POST | `/api/auth/login/` | Login and get auth token |

### Games
| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/api/live/` | Get live game scores |
| GET | `/api/games/date/<date>/` | Get games by date |
| GET | `/api/games/<game_id>/` | Get game box score |

### Teams
| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/api/teams/` | Get all NBA teams |
| GET | `/api/teams/<team_id>/stats/` | Get team statistics |
| GET | `/api/teams/<team_id>/averages/` | Get team averages |
| GET | `/api/teams/<team_id>/roster/` | Get team roster |
| GET | `/api/teams/<team_id>/gamelog/` | Get team game log |
| GET | `/api/teams/<team_id>/gamelog/export/` | Export team game log as CSV |

### Players
| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/api/players/` | Get all NBA players |
| GET | `/api/players/<player_id>/` | Get player info |
| GET | `/api/players/<player_id>/averages/` | Get player current stats |
| GET | `/api/players/<player_id>/gamelog/` | Get player game log |
| GET | `/api/players/<player_id>/gamelog/export/` | Export player game log as CSV |

### Leaders
| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/api/leaders/points/` | Points leaders |
| GET | `/api/leaders/rebounds/` | Rebound leaders |
| GET | `/api/leaders/assists/` | Assist leaders |
| GET | `/api/leaders/blocks/` | Blocks leaders |
| GET | `/api/leaders/steals/` | Steals leaders |
| GET | `/api/leaders/fgm/` | Field goals made leaders |

### Standings
| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/api/standings/` | Get league standings |

### Favorites (Authenticated)
| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/api/user/favorites/` | Get user's favorites |
| GET/POST | `/api/players/<player_id>/favorite/` | Toggle favorite player |
| GET/POST | `/api/teams/<team_id>/favorite/` | Toggle favorite team |

## Project Structure

```
Nba_score/
├── nba_scor/
│   ├── api/                 # Django REST API app
│   │   ├── models.py        # Database models
│   │   ├── views.py         # API views
│   │   ├── urls.py          # API routes
│   │   └── serializers.py   # DRF serializers
│   ├── app/                 # Django project settings
│   │   └── settings.py      # Configuration
│   ├── frontend/            # React frontend
│   │   ├── src/
│   │   │   ├── components/  # React components
│   │   │   ├── routes/      # Page components
│   │   │   └── context/     # Auth context
│   │   └── package.json
│   └── manage.py
├── LICENSE
└── README.md
```

## License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## Acknowledgments

- [nba_api](https://github.com/swar/nba_api) - NBA Stats API wrapper
- [NBA](https://www.nba.com) - Official NBA data source
