from django.urls import path
import api.views as views

urlpatterns = [
    path('live/', views.live_game),
    path('teams/', views.get_all_teams),
    path('players/', views.get_all_players),
    path('players/<str:player_id>/', views.get_player_stats),
    path('players/<str:player_id>/current/', views.get_player_current_stats),
    path('leaders/points/', views.get_points_leaders),
    path('leaders/rebounds/', views.get_rebound_leaders),
    path('leaders/assists/', views.get_assist_leaders),
]