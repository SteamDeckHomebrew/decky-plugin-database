# Decky Plugin Backup

Sichert und stellt Decky-Plugins und deren Einstellungen auf dem Steam Deck wieder her. Unterstützt YAML-Backups mit eingebetteten Base64-Archiven oder externen TAR.GZ-Archiven. Enthält ein minimales UI in Decky sowie eine vollständige CLI.

## Features
- Backup in YAML inkl. Plugin-Namen und Einstellungen
- Auswahl konkreter Plugins oder alle
- Speicherung in `$HOME/decky_backups`
- Wiederherstellung inkl. Installation der Plugins (aus eingebetteten oder externen Archiven)
- CLI mit Bestätigungen und Validierung
- UI mit Rückmeldungen („Backup abgeschlossen“, „Wiederherstellung abgeschlossen“)

## Installation
1. Kopiere den Ordner in `~/homebrew/plugins/decky-plugin-backup`.
2. Öffne Decky Loader und aktiviere das Plugin.

## CLI
Beispiele:
- `python3 ~/homebrew/plugins/decky-plugin-backup/backend/backup_restore.py backup --all`
- `python3 ~/homebrew/plugins/decky-plugin-backup/backend/backup_restore.py backup --plugins PluginA PluginB`
- `python3 ~/homebrew/plugins/decky-plugin-backup/backend/backup_restore.py backup --embed`
- `python3 ~/homebrew/plugins/decky-plugin-backup/backend/backup_restore.py restore --file $HOME/decky_backups/decky_backup.yaml`
- `python3 ~/homebrew/plugins/decky-plugin-backup/backend/backup_restore.py validate --file $HOME/decky_backups/decky_backup.yaml`

## Hinweise
- Einstellungen werden aus `~/.config/decky-loader/plugin_settings.json` gelesen und dorthin zurückgeschrieben.
- Backups werden nach `~/$HOME/decky_backups` mit Verzeichnisrechten `700` gespeichert.
- Vor dem Überschreiben wird eine Bestätigung eingeholt, außer `--force` ist gesetzt.
- Bei externen Archiven muss die TAR.GZ-Datei verfügbar sein; sonst werden nur Einstellungen wiederhergestellt.

## Fehlerbehandlung
- Klares Logging bei fehlenden Plugins, ungültigen YAMLs, fehlenden Archiven oder Prüfsummenfehlern.
- Restore überspringt einzelne Plugins bei Fehlern und setzt die restlichen fort.

## Lizenz
MIT
