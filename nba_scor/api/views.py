from django.shortcuts import render
from django.http import JsonResponse, Http404
from .models import Player
from nba_api.stats.static import teams, players
from nba_api.stats.endpoints import playercareerstats, playergamelog
from nba_api.live.nba.endpoints import scoreboard


def live_game(request):
    scoreboard_data = scoreboard.ScoreBoard()
    games_json = scoreboard_data.get_dict()
    games = games_json['scoreboard']['games']
    return JsonResponse(games, safe=False)


def get_all_teams(request):
    all_teams = teams.get_teams()
    return JsonResponse(all_teams, safe=False)

def get_all_players(request):
    all_players = players.get_active_players()
    return JsonResponse(all_players, safe=False)

def get_player_stats(request, player_id):
    try:
        career_stats = playercareerstats.PlayerCareerStats(player_id=player_id)
        stats_dict = career_stats.get_dict()
        
        all_players = players.get_players()
        player_info = next((player for player in all_players if player['id'] == int(player_id)), None)
        
        if not player_info:
            raise Http404("Player not found")
            
        response_data = {
            'player_info': player_info,
            'career_stats': stats_dict
        }
        
        return JsonResponse(response_data)
    except Exception as e:
        return JsonResponse({'error': str(e)}, status=400)
