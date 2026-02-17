from django.db import models
from django.contrib.auth.models import User

# Create your models here.
class Team(models.Model):
    nba_id = models.IntegerField(unique=True)
    full_name = models.CharField(max_length=100)
    abbreviation = models.CharField(max_length=10)
    city = models.CharField(max_length=50)
    conference = models.CharField(max_length=20, null=True, blank=True)
    division = models.CharField(max_length=50, null=True, blank=True)

    def __str__(self):
        return self.full_name


class Player(models.Model):
    nba_id = models.IntegerField(unique=True)
    full_name = models.CharField(max_length=100)
    first_name = models.CharField(max_length=50)
    last_name = models.CharField(max_length=50)
    team = models.ForeignKey(Team, on_delete=models.SET_NULL, null=True, blank=True)
    is_active = models.BooleanField(default=True)

    def __str__(self):
        return self.full_name

# Add this to api/models.py
class FavoriteTeam(models.Model):
    user = models.ForeignKey(User, on_delete=models.CASCADE, related_name='favorite_teams')
    team_id = models.IntegerField()
    team_name = models.CharField(max_length=100)
    team_abbreviation = models.CharField(max_length=10)
    created_at = models.DateTimeField(auto_now_add=True)

    class Meta:
        unique_together = ('user', 'team_id')

class FavoritePlayer(models.Model):
    user = models.ForeignKey(User, on_delete=models.CASCADE, related_name='favorite_players')
    player_id = models.IntegerField()
    player_name = models.CharField(max_length=100)
    created_at = models.DateTimeField(auto_now_add=True)

    class Meta:
        unique_together = ('user', 'player_id')

