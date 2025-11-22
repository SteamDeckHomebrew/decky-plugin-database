import asyncio
import json
import os
from pathlib import Path

# Minimaler Decky-Backend-Hook: bietet zwei RPC-Methoden für das UI.
# Das CLI liegt in backup_restore.py und kann unabhängig genutzt werden.

class Plugin:
    async def _main(self):
        # Keine Hintergrundaufgabe nötig
        pass

    async def backup(self):
        """
        Führt ein Backup aller Plugins aus (nicht eingebettet, externes Archiv).
        """
        from .backup_restore import build_arg_parser, cmd_backup
        class Args: pass
        args = Args()
        args.all = True
        args.plugins = None
        args.embed = False
        args.out = None
        args.tar = None
        args.force = True
        cmd_backup(args)
        return {"status": "ok", "message": "Backup abgeschlossen"}

    async def restore(self):
        """
        Stellt aus Standard-YAML wieder her.
        """
        from .backup_restore import build_arg_parser, cmd_restore
        class Args: pass
        args = Args()
        args.file = Path(os.path.expanduser("~")) / "decky_backups" / "decky_backup.yaml"
        args.force = True
        cmd_restore(args)
        return {"status": "ok", "message": "Wiederherstellung abgeschlossen"}

    async def _unload(self):
        pass
