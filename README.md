# Decky Plugin Database [![Chat](https://img.shields.io/badge/chat-on%20discord-7289da.svg)](https://deckbrew.xyz/discord)

**This repository exists solely for developers to submit plugins**

Use the built-in [Plugin Store](https://wiki.deckbrew.xyz/en/user-guide/plugin-store) to download and install plugins.

## Submit your plugin

**For plugin developers submitting their plugin for the first time, please consult the wiki page on [submitting your plugin](https://wiki.deckbrew.xyz/en/plugin-dev/submitting-plugins).**
This README provides a good resource for the simple git related and a few other items, but the wiki has the rest of the information you'll need.

To submit a plugin to Decky's plugin store, open a pull request adding your plugin as a submodule (take a look at [#189](https://github.com/SteamDeckHomebrew/decky-plugin-database/pull/189) for example).
Don't forget to bump your version number in package.json.
If you are not sure how to make a submodule, please reference the [git docs](https://git-scm.com/book/en/v2/Git-Tools-Submodules) on submodules.

Once you have your submodule added, in order to update it to a newer version:

1. `git checkout main` (ensure you are in sync with upstream from your fork and pull)
2. `git checkout -b update/your-plugin` (or whatever you like to call it)
3. `cd plugins/your-plugin`
4. `git pull`
5. `cd ../..`
6. `git add plugins/your-plugin`
7. `git commit -m "your commit message"`
8. `git push`

## Testing Other's Plugins

While not required, testing other developers' plugins can help the community and may prioritize your own pull request. If you choose to participate in community testing, you can follow the [testing guide](https://wiki.deckbrew.xyz/user-guide/testing) to learn how to test other plugins and provide valuable feedback.

You can easily track PRs that are ready for review in this view: [SDH Tracker](https://github.com/orgs/SteamDeckHomebrew/projects/9/views/11)

Please make sure your plugin is compliant with the pull-request template's steps.
Plugins found to be out of compliance will not be accepted.
If your plugin does not meet any of the criteria for utilizing a custom backend, then it only requires testing against Stable and Beta SteamOS Update Channels.
