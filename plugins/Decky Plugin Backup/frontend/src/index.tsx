import { definePlugin, ServerAPI, Button, PanelSection, PanelSectionRow, showToast } from "decky-frontend-lib";
import React from "react";

let server: ServerAPI;

const BackupRestorePanel: React.FC = () => {
  const doBackup = async () => {
    try {
      const res = await server.callPluginMethod<{ status: string; message: string }>("backup", {});
      showToast(res?.message ?? "Backup abgeschlossen");
    } catch (e) {
      showToast("Backup fehlgeschlagen");
    }
  };

  const doRestore = async () => {
    try {
      const res = await server.callPluginMethod<{ status: string; message: string }>("restore", {});
      showToast(res?.message ?? "Wiederherstellung abgeschlossen");
    } catch (e) {
      showToast("Wiederherstellung fehlgeschlagen");
    }
  };

  return (
    <PanelSection title="Backup & Restore">
      <PanelSectionRow>
        <Button onClick={doBackup}>Backup erstellen</Button>
      </PanelSectionRow>
      <PanelSectionRow>
        <Button onClick={doRestore} style={{ backgroundColor: "#e07a5f" }}>
          Wiederherstellen
        </Button>
      </PanelSectionRow>
      <PanelSectionRow>
        <small>
          CLI verfügbar: backend/backup_restore.py — sichere Backups in $HOME/decky_backups. Vor dem Überschreiben wird
          bestätigt (außer mit --force).
        </small>
      </PanelSectionRow>
    </PanelSection>
  );
};

export default definePlugin((serverApi: ServerAPI) => {
  server = serverApi;
  return {
    title: "Decky Plugin Backup",
    content: <BackupRestorePanel />,
  };
});
