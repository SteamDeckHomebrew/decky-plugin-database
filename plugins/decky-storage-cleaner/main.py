#!/usr/bin/env python3
import shutil
import os
import urllib.request
import json
import math

homeDir = os.environ['DECKY_PLUGIN_DIR']

class Plugin:
    async def _listdirs(self, rootdir):
        subdirectories = []
        for item in os.listdir(rootdir):
            subdirectories.append(item)
        
        return subdirectories
    
    async def _convert_size(self, size_bytes):
        if size_bytes == 0:
            return "0B"
        size_name = ("B", "KB", "MB", "GB", "TB", "PB", "EB", "ZB", "YB")
        i = int(math.floor(math.log(size_bytes, 1024)))
        p = math.pow(1024, i)
        s = round(size_bytes / p, 2)
        return "%s %s" % (s, size_name[i])

    async def get_size(self, dirName):
        total_size = 0
        for dirpath, dirnames, filenames in os.walk('/home/deck/.steam/steam/steamapps/' + dirName):
            for f in filenames:
                fp = os.path.join(dirpath, f)
                # skip if it is symbolic link
                if not os.path.islink(fp):
                    total_size += os.path.getsize(fp)

        return await self._convert_size(self, total_size)

    async def list_games_with_temp_data(self, dirName):
        # try to fetch GetAppList url, otherwise fallback to static data (poor man's offline mode)
        try:
            response = urllib.request.urlopen('http://api.steampowered.com/ISteamApps/GetAppList/v0002/')
        except:
            response = open(homeDir + '/assets/GetAppListV0002.json')
        
        all_games = json.loads(response.read())['applist']['apps']

        # list games on steam deck
        local_game_ids = await self._listdirs(self, '/home/deck/.steam/steam/steamapps/' + dirName)

        games_found = list(filter(lambda d: str(d['appid']) in local_game_ids, all_games))

        return json.dumps(games_found)

    async def delete_cache(self, dirName):
        await shutil.rmtree('/home/deck/.steam/steam/steamapps/' + dirName)