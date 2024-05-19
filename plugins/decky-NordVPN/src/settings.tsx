import { ServerAPI } from "decky-frontend-lib"

export class SettingsManager {
    private serverApi: ServerAPI;

    constructor(serverApi: ServerAPI) {
        this.serverApi = serverApi;
    }

    async read(): Promise<boolean> {
        return (await this.serverApi.callPluginMethod("settings_read", {})).success
    }

    async commit(): Promise<boolean> {
        return (await this.serverApi.callPluginMethod("settings_commit", {})).success
    }

    async getSetting(key: string, defaults: any): Promise<string> {
        return (await this.serverApi.callPluginMethod("settings_getSetting", {"key": key, "defaults": defaults})).result as string
    }

    async setSetting(key: string, value: any): Promise<boolean> {
        return (await this.serverApi.callPluginMethod("settings_setSetting", {"key": key, "value": value})).success 
    }

    async settingExists(key: string): Promise<boolean> {
        return (await this.serverApi.callPluginMethod("settings_settingExists", {"key": key})).result as boolean
    }
}