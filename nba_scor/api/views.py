from django.shortcuts import render
from django.http import JsonResponse, Http404
from .models import Player
from nba_api.stats.static import teams, players
from nba_api.stats.endpoints import playercareerstats, playergamelog, commonallplayers, playerdashboardbyyearoveryear, leagueleaders
from nba_api.live.nba.endpoints import scoreboard

def live_game(request):
    try:
        scoreboard_data = scoreboard.ScoreBoard()
        games_json = scoreboard_data.get_dict()
        games = games_json['scoreboard']['games']
        return JsonResponse(games, safe=False)
    except Exception as e:
        return JsonResponse({'error': str(e)}, status=400)


def get_all_teams(request):
    try:
        all_teams = teams.get_teams()
        return JsonResponse(all_teams, safe=False)
    except Exception as e:
        return JsonResponse({'error': str(e)}, status=400)


def get_all_players(request):
    try:
        response = commonallplayers.CommonAllPlayers(is_only_current_season=1)
        all_players = response.get_data_frames()[0].to_dict(orient='records')
        return JsonResponse(all_players, safe=False)
    except Exception as e:
        return JsonResponse({'error': str(e)}, status=400)


def get_player_stats(request, player_id):
    try:
        career_stats = playercareerstats.PlayerCareerStats(player_id=player_id)
        stats_dict = career_stats.get_dict()
        
        # Get player info from static data
        all_players = players.get_players()
        player_info = next((player for player in all_players if player['id'] == int(player_id)), None)
        
        if not player_info:
            raise Http404("Player not found")
        
        # Get current team from CommonAllPlayers
        current_players = commonallplayers.CommonAllPlayers(is_only_current_season=1)
        current_players_df = current_players.get_data_frames()[0]
        player_current = current_players_df[current_players_df['PERSON_ID'] == int(player_id)]
        
        team_info = None
        if not player_current.empty:
            team_id = player_current.iloc[0].get('TEAM_ID')
            team_abbr = player_current.iloc[0].get('TEAM_ABBREVIATION')
            team_name = player_current.iloc[0].get('TEAM_NAME')
            team_city = player_current.iloc[0].get('TEAM_CITY')
            
            team_info = {
                'team_id': int(team_id) if team_id else None,
                'team_abbreviation': team_abbr if team_abbr else None,
                'team_name': team_name if team_name else None,
                'team_city': team_city if team_city else None
            }
            
        response_data = {
            'player_info': player_info,
            'team_info': team_info,
            'career_stats': stats_dict
        }
        
        return JsonResponse(response_data)
    except Exception as e:
        return JsonResponse({'error': str(e)}, status=400)


def get_player_current_stats(request, player_id):
    try:
        # Define current season (2025-26)
        current_season = '2025-26'
        
        # Get current season stats (year-over-year dashboard)
        dashboard = playerdashboardbyyearoveryear.PlayerDashboardByYearOverYear(
            player_id=player_id,
            per_mode_detailed='PerGame'
        )
        
        # Get the dataframe with per-game stats
        stats_df = dashboard.get_data_frames()[1]  # OverallPlayerDashboard contains the stats
        
        if stats_df.empty:
            raise Http404("No stats found for this player")
        
        # Filter for current season only
        current_season_data = stats_df[stats_df['GROUP_VALUE'] == current_season]
        
        if current_season_data.empty:
            # Player hasn't played this season yet
            return JsonResponse({
                'points': 0.0,
                'rebounds': 0.0,
                'assists': 0.0,
                'steals': 0.0,
                'blocks': 0.0,
                'games_played': 0,
                'field_goal_pct': 0.0,
                'three_point_pct': 0.0,
                'free_throw_pct': 0.0,
                'season': current_season,
                'has_played': False
            })
        
        # Get the current season stats
        season_stats = current_season_data.iloc[0]
        
        # Extract basic stats
        basic_stats = {
            'points': float(season_stats.get('PTS', 0)),
            'rebounds': float(season_stats.get('REB', 0)),
            'assists': float(season_stats.get('AST', 0)),
            'steals': float(season_stats.get('STL', 0)),
            'blocks': float(season_stats.get('BLK', 0)),
            'games_played': int(season_stats.get('GP', 0)),
            'field_goal_pct': float(season_stats.get('FG_PCT', 0)),
            'three_point_pct': float(season_stats.get('FG3_PCT', 0)),
            'free_throw_pct': float(season_stats.get('FT_PCT', 0)),
            'season': current_season,
            'has_played': True
        }
        
        return JsonResponse(basic_stats)
    except Exception as e:
        return JsonResponse({'error': str(e)}, status=400)


def get_points_leaders(request):
    try:
        # Get league leaders for points per game
        leaders = leagueleaders.LeagueLeaders(
            league_id='00',
            per_mode48='PerGame',
            scope='S',
            season='2025-26',
            season_type_all_star='Regular Season',
            stat_category_abbreviation='PTS'
        )
        
        leaders_df = leaders.get_data_frames()[0]
        
        top_10 = leaders_df.head(10)
        
        # Format the response
        leaders_list = []
        for _, row in top_10.iterrows():
            leaders_list.append({
                'rank': int(row['RANK']),
                'player_id': int(row['PLAYER_ID']),
                'player_name': row['PLAYER'],
                'team': row.get('TEAM_ABBREVIATION', row.get('TEAM', 'N/A')),
                'games_played': int(row['GP']),
                'points': float(row['PTS']),
            })
        
        return JsonResponse(leaders_list, safe=False)
    except Exception as e:
        return JsonResponse({'error': str(e)}, status=400)

def get_rebound_leaders(request):
    try:
        # Get league leaders for points per game
        leaders = leagueleaders.LeagueLeaders(
            league_id='00',
            per_mode48='PerGame',
            scope='S',
            season='2025-26',
            season_type_all_star='Regular Season',
            stat_category_abbreviation='REB'
        )
        
        leaders_df = leaders.get_data_frames()[0]
        
        top_10 = leaders_df.head(10)
        
        # Format the response
        leaders_list = []
        for _, row in top_10.iterrows():
            leaders_list.append({
                'rank': int(row['RANK']),
                'player_id': int(row['PLAYER_ID']),
                'player_name': row['PLAYER'],
                'team': row.get('TEAM_ABBREVIATION', row.get('TEAM', 'N/A')),
                'games_played': int(row['GP']),
                'rebounds': float(row['REB']),
            })
        
        return JsonResponse(leaders_list, safe=False)
    except Exception as e:
        return JsonResponse({'error': str(e)}, status=400)

def get_assist_leaders(request):
    try:
        # Get league leaders for assists per game
        leaders = leagueleaders.LeagueLeaders(
            league_id='00',
            per_mode48='PerGame',
            scope='S',
            season='2025-26',
            season_type_all_star='Regular Season',
            stat_category_abbreviation='AST'
        )
        
        leaders_df = leaders.get_data_frames()[0]
        
        top_10 = leaders_df.head(10)
        
        # Format the response
        leaders_list = []
        for _, row in top_10.iterrows():
            leaders_list.append({
                'rank': int(row['RANK']),
                'player_id': int(row['PLAYER_ID']),
                'player_name': row['PLAYER'],
                'team': row.get('TEAM_ABBREVIATION', row.get('TEAM', 'N/A')),
                'games_played': int(row['GP']),
                'assists': float(row['AST']),
            })
        
        return JsonResponse(leaders_list, safe=False)
    except Exception as e:
        return JsonResponse({'error': str(e)}, status=400)