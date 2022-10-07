import { ServerAPI, ServerResponse } from "decky-frontend-lib";
import { Shortcut } from "./lib/data-structures/Shortcut";

type ShortcutsDictionary = {
    [key:string]: Shortcut
}

export class PyInterop {
    private static serverAPI:ServerAPI;

    static setServer(serv:ServerAPI) {
        this.serverAPI = serv;
    }

    static get server() { return this.serverAPI; }

    static async getShortcuts(): Promise<ServerResponse<ShortcutsDictionary>> {
        return await this.serverAPI.callPluginMethod<{}, ShortcutsDictionary>("getShortcuts", {});
    }
    static async addShortcut(shortcut:Shortcut): Promise<ServerResponse<ShortcutsDictionary>> {
        return await this.serverAPI.callPluginMethod<{shortcut:Shortcut}, ShortcutsDictionary>("addShortcut", { shortcut: shortcut });
    }
    static async setShortcuts(shortcuts:Shortcut[]): Promise<ServerResponse<ShortcutsDictionary>> {
        return await this.serverAPI.callPluginMethod<{shortcuts:Shortcut[]}, ShortcutsDictionary>("setShortcuts", { shortcuts: shortcuts });
    }
    static async modShortcut(shortcut:Shortcut): Promise<ServerResponse<ShortcutsDictionary>> {
        return await this.serverAPI.callPluginMethod<{shortcut:Shortcut}, ShortcutsDictionary>("modShortcut", { shortcut: shortcut });
    }
    static async remShortcut(shortcut:Shortcut): Promise<ServerResponse<ShortcutsDictionary>> {
        return await this.serverAPI.callPluginMethod<{shortcut:Shortcut}, ShortcutsDictionary>("remShortcut", { shortcut: shortcut });
    }

    static async getInstalledApps(): Promise<ServerResponse<Application[]>> {
        const apps = await this.serverAPI.callPluginMethod<{}, Application[]>("getInstalledApps", {});
        return apps;
    }
}