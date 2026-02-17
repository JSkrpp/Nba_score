from django.core.management.base import BaseCommand
from api.models import Team, Player
from nba_api.stats.static import teams
from nba_api.stats.endpoints import commonallplayers
import time

class Command(BaseCommand):
    help = 'Imports NBA teams and players from nba_api into the database'

    def handle(self, *args, **options):
        self.stdout.write('Starting NBA data import...')

        # 1. Import Teams
        self.stdout.write('Fetching teams from nba_api...')
        nba_teams = teams.get_teams()
        
        self.stdout.write(f'Found {len(nba_teams)} teams. Saving to database...')
        
        teams_created = 0
        teams_updated = 0
        
        for team_data in nba_teams:
            team, created = Team.objects.update_or_create(
                nba_id=team_data['id'],
                defaults={
                    'full_name': team_data['full_name'],
                    'abbreviation': team_data['abbreviation'],
                    'city': team_data['city'],
                    # Conference and division are not available in static.teams
                    # We leave them as they are (null) or update if we had a source
                }
            )
            if created:
                teams_created += 1
            else:
                teams_updated += 1
                
        self.stdout.write(self.style.SUCCESS(f'Teams: {teams_created} created, {teams_updated} updated.'))

        # 2. Import Players
        self.stdout.write('Fetching players from nba_api (CommonAllPlayers)...')
        # Using is_only_current_season=1 as per views.py
        player_info = commonallplayers.CommonAllPlayers(is_only_current_season=1)
        players_df = player_info.get_data_frames()[0]
        players_data = players_df.to_dict('records')
        
        self.stdout.write(f'Found {len(players_data)} players. Saving to database...')
        
        players_created = 0
        players_updated = 0
        
        for p_data in players_data:
            try:
                # Map fields
                nba_id = p_data['PERSON_ID']
                full_name = p_data['DISPLAY_FIRST_LAST']
                
                # Simple split for first/last name
                name_parts = full_name.split(' ', 1)
                first_name = name_parts[0]
                last_name = name_parts[1] if len(name_parts) > 1 else ''
                
                team_id = p_data.get('TEAM_ID')
                
                # Find the team object if it exists
                team_obj = None
                if team_id:
                    try:
                        team_obj = Team.objects.get(nba_id=team_id)
                    except Team.DoesNotExist:
                        self.stdout.write(self.style.WARNING(f"Team ID {team_id} not found for player {full_name}"))
                
                player, created = Player.objects.update_or_create(
                    nba_id=nba_id,
                    defaults={
                        'full_name': full_name,
                        'first_name': first_name,
                        'last_name': last_name,
                        'team': team_obj,
                        'is_active': True # We are fetching current season players
                    }
                )
                
                if created:
                    players_created += 1
                else:
                    players_updated += 1
                    
            except Exception as e:
                self.stdout.write(self.style.ERROR(f"Error processing player {p_data.get('DISPLAY_FIRST_LAST')}: {str(e)}"))

        self.stdout.write(self.style.SUCCESS(f'Players: {players_created} created, {players_updated} updated.'))
        self.stdout.write(self.style.SUCCESS('Import completed successfully.'))
