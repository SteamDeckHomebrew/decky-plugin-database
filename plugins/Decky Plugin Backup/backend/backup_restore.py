#!/usr/bin/env python3
import argparse
import base64
import datetime
import getpass
import json
import os
import shutil
import sys
import tarfile
import tempfile
from pathlib import Path
from typing import Dict, List, Tuple, Optional
import hashlib
import yaml  # PyYAML erforderlich

# Standardpfade (SteamOS / Decky)
HOME = Path(os.path.expanduser("~"))
PLUGINS_DIR = HOME / "homebrew" / "plugins"
DECKY_CONFIG_DIR = HOME / ".config" / "decky-loader"
DECKY_SETTINGS_FILE = DECKY_CONFIG_DIR / "plugin_settings.json"
BACKUP_DIR = HOME / "decky_backups"
DEFAULT_YAML = BACKUP_DIR / "decky_backup.yaml"
DEFAULT_TAR = BACKUP_DIR / "decky_backup_content.tar.gz"

def ensure_secure_dir(path: Path):
    path.mkdir(parents=True, exist_ok=True)
    try:
        os.chmod(path, 0o700)
    except Exception:
        pass  # Auf einigen FS evtl. nicht verfügbar

def read_settings() -> Dict[str, dict]:
    if DECKY_SETTINGS_FILE.exists():
        try:
            with open(DECKY_SETTINGS_FILE, "r", encoding="utf-8") as f:
                data = json.load(f)
                # Erwartet: { "PluginName": { ...settings... }, ... }
                if isinstance(data, dict):
                    return data
        except Exception as e:
            print(f"[WARN] Einstellungen konnten nicht gelesen werden: {e}")
    return {}

def list_installed_plugins() -> List[str]:
    if not PLUGINS_DIR.exists():
        return []
    plugins = []
    for p in PLUGINS_DIR.iterdir():
        if p.is_dir() and (p / "plugin.json").exists():
            plugins.append(p.name)
    return sorted(plugins)

def confirm(prompt: str) -> bool:
    ans = input(f"{prompt} [y/N]: ").strip().lower()
    return ans in ("y", "yes")

def sha256_file(path: Path) -> str:
    h = hashlib.sha256()
    with open(path, "rb") as f:
        for chunk in iter(lambda: f.read(65536), b""):
            h.update(chunk)
    return h.hexdigest()

def create_tar_for_plugins(plugin_names: List[str], out_tar: Path) -> Tuple[Path, Dict[str, str]]:
    ensure_secure_dir(out_tar.parent)
    with tarfile.open(out_tar, "w:gz") as tar:
        checksums = {}
        for name in plugin_names:
            src = PLUGINS_DIR / name
            if not src.exists():
                print(f"[WARN] Plugin-Ordner fehlt: {name}")
                continue
            tar.add(src, arcname=name)
        # Tar schließen, dann Checksummen pro Pluginordner berechnen über temporäre Extraktion
    # Berechne checksum des gesamten Tar (zur Integrität)
    tar_checksum = sha256_file(out_tar)
    return out_tar, {"_tar_sha256": tar_checksum}

def embed_plugin_dir_as_base64(name: str) -> Tuple[str, str]:
    src = PLUGINS_DIR / name
    if not src.exists():
        raise FileNotFoundError(f"Plugin-Ordner nicht gefunden: {name}")
    with tempfile.NamedTemporaryFile(suffix=".tar.gz", delete=False) as tmp:
        tmp_path = Path(tmp.name)
    try:
        with tarfile.open(tmp_path, "w:gz") as tar:
            tar.add(src, arcname=name)
        digest = sha256_file(tmp_path)
        with open(tmp_path, "rb") as f:
            b64 = base64.b64encode(f.read()).decode("utf-8")
        return b64, digest
    finally:
        try:
            os.remove(tmp_path)
        except Exception:
            pass

def save_yaml(payload: dict, path: Path, force: bool = False):
    ensure_secure_dir(path.parent)
    if path.exists() and not force:
        if not confirm(f"Datei {path} existiert. Überschreiben?"):
            print("[INFO] Abgebrochen.")
            sys.exit(1)
    with open(path, "w", encoding="utf-8") as f:
        yaml.safe_dump(payload, f, sort_keys=False, allow_unicode=True)
    print(f"[OK] Backup gespeichert: {path}")

def load_yaml(path: Path) -> dict:
    with open(path, "r", encoding="utf-8") as f:
        data = yaml.safe_load(f)
        if not isinstance(data, dict):
            raise ValueError("Ungültiges YAML-Format (erwartet Objekt an der Wurzel).")
        if data.get("version") != 1:
            raise ValueError("Nicht unterstützte Backup-Version.")
        return data

def restore_archive_embedded(b64: str, checksum: Optional[str], plugin_name: str):
    raw = base64.b64decode(b64.encode("utf-8"))
    with tempfile.NamedTemporaryFile(suffix=".tar.gz", delete=False) as tmp:
        tmp_path = Path(tmp.name)
        tmp.write(raw)
    try:
        if checksum:
            calc = sha256_file(tmp_path)
            if calc != checksum:
                raise ValueError(f"Checksum mismatch für {plugin_name} (expected {checksum}, got {calc})")
        with tarfile.open(tmp_path, "r:gz") as tar:
            tar.extractall(path=PLUGINS_DIR)
    finally:
        try:
            os.remove(tmp_path)
        except Exception:
            pass

def restore_from_external_tar(tar_path: Path, plugin_name: str):
    with tarfile.open(tar_path, "r:gz") as tar:
        members = [m for m in tar.getmembers() if m.name.split("/")[0] == plugin_name]
        if not members:
            raise FileNotFoundError(f"{plugin_name} nicht im Archiv {tar_path}.")
        tar.extractall(path=PLUGINS_DIR, members=members)

def apply_settings(settings_map: Dict[str, dict]):
    current = read_settings()
    merged = current.copy()
    # Tiefe Merges können später ergänzt werden; hier ersetzen wir pro Plugin
    for name, s in settings_map.items():
        merged[name] = s if isinstance(s, dict) else {}
    ensure_secure_dir(DECKY_CONFIG_DIR)
    with open(DECKY_SETTINGS_FILE, "w", encoding="utf-8") as f:
        json.dump(merged, f, ensure_ascii=False, indent=2)
    print("[OK] Einstellungen angewendet.")

def cmd_backup(args: argparse.Namespace):
    ensure_secure_dir(BACKUP_DIR)
    plugins = list_installed_plugins()
    if args.all:
        selected = plugins
    else:
        if not args.plugins:
            print("[ERROR] Bitte Plugins mit --plugins angeben oder --all verwenden.")
            sys.exit(1)
        selected = [p for p in args.plugins if p in plugins]
        missing = set(args.plugins) - set(selected)
        if missing:
            print(f"[WARN] Nicht installiert: {', '.join(sorted(missing))}")
    settings = read_settings()
    items = []
    settings_map = {}
    for name in selected:
        s = settings.get(name, {})
        settings_map[name] = s
        if args.embed:
            try:
                b64, digest = embed_plugin_dir_as_base64(name)
                items.append({
                    "name": name,
                    "settings": s,
                    "archive_embedded": True,
                    "archive_base64": b64,
                    "checksum_sha256": digest
                })
            except Exception as e:
                print(f"[ERROR] Einbetten fehlgeschlagen für {name}: {e}")
        else:
            items.append({
                "name": name,
                "settings": s,
                "archive_embedded": False
            })
    payload = {
        "version": 1,
        "created_at": datetime.datetime.utcnow().replace(microsecond=0).isoformat() + "Z",
        "user": getpass.getuser(),
        "plugins_dir": str(PLUGINS_DIR),
        "settings_source": str(DECKY_SETTINGS_FILE),
        "items": items,
        "archives": {}
    }
    if not args.embed:
        tar_out = args.tar or DEFAULT_TAR
        tar_path, checksums = create_tar_for_plugins(selected, tar_out)
        payload["archives"] = {
            "external_tar_gz": str(tar_path),
            "checksums": checksums
        }
        print(f"[OK] Archiv erstellt: {tar_path}")
    yaml_out = args.out or DEFAULT_YAML
    save_yaml(payload, yaml_out, force=args.force)
    print("[OK] Backup abgeschlossen.")

def validate_yaml(path: Path):
    data = load_yaml(path)
    print("[OK] YAML geladen.")
    # Grundvalidierung
    if "items" not in data or not isinstance(data["items"], list):
        raise ValueError("items fehlt oder ist kein Array.")
    for item in data["items"]:
        if "name" not in item:
            raise ValueError("Plugin-Eintrag ohne name.")
        if item.get("archive_embedded"):
            if "archive_base64" not in item:
                raise ValueError(f"{item['name']}: archive_base64 fehlt.")
    print("[OK] Struktur valide.")
    ext = data.get("archives", {}).get("external_tar_gz")
    if ext:
        p = Path(ext)
        if not p.exists():
            print(f"[WARN] Externes Archiv fehlt: {p}")
        else:
            print(f"[OK] Externes Archiv vorhanden: {p}")

def cmd_restore(args: argparse.Namespace):
    yaml_in = args.file or DEFAULT_YAML
    data = load_yaml(yaml_in)
    ensure_secure_dir(PLUGINS_DIR)
    ext_tar_path = None
    if data.get("archives", {}).get("external_tar_gz"):
        ext_tar_path = Path(data["archives"]["external_tar_gz"])
        if not ext_tar_path.exists():
            print(f"[WARN] Externes Archiv nicht gefunden: {ext_tar_path}")
            ext_tar_path = None

    target_plugins = [i["name"] for i in data["items"]]
    # Bestätigung vor Überschreiben existierender Plugins
    conflicts = [p for p in target_plugins if (PLUGINS_DIR / p).exists()]
    if conflicts and not args.force:
        if not confirm(f"Folgende Plugins werden überschrieben: {', '.join(conflicts)}. Fortfahren?"):
            print("[INFO] Abgebrochen.")
            sys.exit(1)

    # Wiederherstellung
    for item in data["items"]:
        name = item["name"]
        print(f"[INFO] Stelle wieder her: {name}")
        try:
            if item.get("archive_embedded"):
                restore_archive_embedded(
                    item["archive_base64"],
                    item.get("checksum_sha256"),
                    name
                )
            elif ext_tar_path:
                restore_from_external_tar(ext_tar_path, name)
            else:
                print(f"[WARN] Keine Archivdaten für {name}. Überspringe Installation.")
        except Exception as e:
            print(f"[ERROR] Wiederherstellung fehlgeschlagen für {name}: {e}")

    # Einstellungen anwenden
    settings_map = {i["name"]: (i.get("settings") or {}) for i in data["items"]}
    apply_settings(settings_map)
    print("[OK] Wiederherstellung abgeschlossen.")

def build_arg_parser():
    p = argparse.ArgumentParser(
        description="Decky Plugin Backup & Restore (YAML + Archiv, inkl. CLI)"
    )
    sub = p.add_subparsers(dest="cmd", required=True)

    b = sub.add_parser("backup", help="Backup erstellen")
    b.add_argument("--all", action="store_true", help="Alle installierten Plugins sichern")
    b.add_argument("--plugins", nargs="*", help="Spezifische Plugins sichern (Namen)")
    b.add_argument("--embed", action="store_true", help="Plugin-Archive in YAML einbetten (Base64)")
    b.add_argument("--out", type=Path, help="Pfad zur YAML-Ausgabedatei")
    b.add_argument("--tar", type=Path, help="Pfad zur externen TAR.GZ-Datei (bei nicht eingebettet)")
    b.add_argument("--force", action="store_true", help="Ohne Bestätigung überschreiben")

    r = sub.add_parser("restore", help="Wiederherstellung aus YAML")
    r.add_argument("--file", type=Path, help="Pfad zur YAML-Backupdatei")
    r.add_argument("--force", action="store_true", help="Ohne Bestätigung überschreiben")

    v = sub.add_parser("validate", help="Backupdatei validieren")
    v.add_argument("--file", type=Path, required=True, help="Pfad zur YAML-Backupdatei")

    return p

def main():
    parser = build_arg_parser()
    args = parser.parse_args()
    cmd = args.cmd
    if cmd == "backup":
        cmd_backup(args)
    elif cmd == "restore":
        cmd_restore(args)
    elif cmd == "validate":
        validate_yaml(args.file)
    else:
        parser.print_help()

if __name__ == "__main__":
    main()
