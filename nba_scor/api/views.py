from django.shortcuts import render
from django.http import JsonResponse
from .models import Player
from nba_api.stats.static import teams

def main(request):
    teamus = teams.find_teams_by_full_name("")
    return JsonResponse(teamus, safe=False)