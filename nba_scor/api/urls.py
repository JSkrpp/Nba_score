from django.urls import path, include
import api.views as views

urlpatterns = [
    path('auth/register/', views.register_user),
    path('auth/login/', views.login_user),
    path('live/', views.live_game),
    path('games/date/<str:date>/', views.get_games_by_date),
    path('games/<str:game_id>/', views.get_game_boxscore),
    path('teams/', views.get_all_teams),
    path('teams/<str:team_id>/stats/', views.get_team_stats),
    path('teams/<str:team_id>/averages/', views.get_team_averages),
    path('teams/<str:team_id>/roster/', views.get_team_roster),
    path('teams/<str:team_id>/gamelog/', views.get_team_game_log),
    path('teams/<str:team_id>/gamelog/export/', views.export_team_game_log_csv),
    path('teams/<str:team_id>/favorite/', views.handle_favorite_team),
    path('user/favorites/', views.get_user_favorites),
    path('players/', views.get_all_players),
    path('players/<str:player_id>/', views.get_player_info),
    path('players/<str:player_id>/averages/', views.get_player_current_stats),
    path('players/<str:player_id>/gamelog/', views.get_player_game_log),
    path('players/<str:player_id>/gamelog/export/', views.export_player_game_log_csv),
    path('players/<str:player_id>/favorite/', views.handle_favorite_player),
    path('leaders/points/', views.get_points_leaders),
    path('leaders/rebounds/', views.get_rebound_leaders),
    path('leaders/assists/', views.get_assist_leaders),
    path('leaders/blocks/', views.get_blocks_leaders),
    path('leaders/steals/', views.get_steals_leaders),
    path('leaders/fgm/', views.get_fgm_leaders),
    path('standings/', views.get_league_standings),
]

