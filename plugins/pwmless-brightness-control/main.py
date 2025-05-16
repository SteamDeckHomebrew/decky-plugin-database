import os
import decky_plugin

class Plugin:
    async def _main(self):
        decky_plugin.logger.info("Overlay plugin started")

    async def _unload(self):
        decky_plugin.logger.info("Overlay plugin stopped")