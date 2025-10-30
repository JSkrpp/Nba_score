from django.urls import path
import api.views as views

urlpatterns = [
    path('live/', views.live_game),
    path('teams/', views.get_all_teams),
    path('players/', views.get_all_players),
    path('players/<str:player_id>/', views.get_player_stats),
]