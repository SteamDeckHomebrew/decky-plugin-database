# Decky Plugin Database [![Chat](https://img.shields.io/badge/chat-on%20discord-7289da.svg)](https://deckbrew.xyz/discord)

**This repository exists solely for developers to submit plugins**

Use the built-in [Plugin Store](https://deckbrew.xyz/en/user-guide/plugin-store) to download and install plugins.

## Submit your plugin
To submit a plugin to Decky's plugin store, open a pull request adding your plugin as a submodule (take a look at [#8](https://github.com/SteamDeckHomebrew/decky-plugin-database/pull/8) for example).
Don't forget to bump your version number in package.json.
If you are not sure how to make a submodule, please reference the [git docs](https://git-scm.com/book/en/v2/Git-Tools-Submodules) on submodules.

Once you have your submodule added, in order to update it,  
change directories to ``plugins/your-plugin`` and run ``git submodule update --init``.  
This should update your plugin to the latest version.

Please make sure your plugin is compliant with the pull-request template's steps.  
Plugins found to be out of compliance will not be accepted.
