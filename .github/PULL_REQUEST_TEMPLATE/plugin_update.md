<!--
    READ ALL COMMENTS IN THIS TEMPLATE BEFORE SUBMITTING YOUR PR!

    This template is for updating an existing plugin on the store WITHOUT changing the repository it is linked to. If you are taking any other action, please start over by creating a new pull request and selecting the appropriate template.

    If you have not already, please read the review and testing page on the wiki.
    https://wiki.deckbrew.xyz/plugin-dev/review-and-testing

    Before submitting, make sure you have done the following:
    - Tested two other plugins and left feedback on their PRs as described below.
    - Replaced REPLACE_WITH_PLUGIN_NAME and REPLACE_WITH_SUMMARY with the appropriate information.
    - Filled out the Task Checklist, including the Yes/No questions.
    - Deleted the unnecessary testing checkbox.
-->

# REPLACE_WITH_PLUGIN_NAME

<!--
    Include a detailed summary of what updates you are adding to the plugin, attaching images or videos if necessary. If this is an urgent update (ex. security patch), please explain the urgency and notify the Loader Team on Discord.
-->

REPLACE_WITH_SUMMARY

## Task Checklist

<!--
    For checkboxes, change [ ] to [x] to check the box.
    For Yes/No questions, replace "Yes/No" with "Yes" or "No".
-->

### Developer

- [ ] I am the original author or an authorized maintainer of this plugin.
- [ ] I have abided by the licenses of the libraries I am utilizing, including attaching license notices where appropriate.

### Plugin

- [ ] I have verified that my plugin works properly on the Stable and Beta update channels of SteamOS.
- [ ] I have verified my plugin is unique or provides more/alternative functionality to a plugin already on the store.

### Backend

- **Yes/No**: I am using a custom backend other than Python.
- **Yes/No**: I am using a tool or software from a 3rd party FOSS project that does not have it's dependencies [statically linked](https://en.wikipedia.org/wiki/Static_library).
- **Yes/No**: I am using a custom binary that has all of it's dependencies statically linked.

### Community

<!--
    Please submit both of your testing reports before creating your PR. You will need to link the comments you left in a comment on this PR.

    If no plugin additions or updates are ready for testing at this time, then you may ignore this checkbox. You may be asked to test new plugins as they are submitted.
-->

- [ ] I have tested and left feedback on two other [pull requests][pulls] for new or updating plugins.
- [ ] I have commented links to my testing report in this PR.

## Testing

<!--
    DO NOT FORGET THIS STEP! Otherwise, testers may incorrectly test your plugin.

    If your plugin uses the provided Python backend and React frontend, your plugin must be tested on the Stable or Beta update channel of SteamOS. REMOVE the line with the Preview checkbox below.

    If your plugin uses a custom backend or pre-build binaries without statically linked dependency (ex. glibc), your plugin must be tested on the SteamOS Preview update channel. REMOVE the line with the Stable or Beta checkbox below.
-->

- [ ] Tested on SteamOS Stable or Beta update channel.
- [ ] Tested on SteamOS Preview update channel.

[pulls]: https://github.com/steamdeckHomebrew/decky-plugin-database/pulls?q=is%3Apr+is%3Aopen+sort%3Acreated-desc+-status%3Afailure+-draft%3Atrue+-author%3A%40me
