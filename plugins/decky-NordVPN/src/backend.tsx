import { ServerAPI } from "decky-frontend-lib";
import { Language } from "./language/language";
import { SettingsManager } from "./settings";


export type Connection = {
    Status: string,
    Hostname: string,
    IP: string,
    Country: string,
    City: string,
    CurrentTechnology: string,
    CurrentProtocol: string,
    Transfer: string,
    Uptime: string
}

export class Backend {
    private serverAPI: ServerAPI;
    private cachedInstalled = false;
    private cachedLoggedIn = false;
    private cachedCountries = "";
    private language: Language;
    private connectionRefreshMethod: Function = function(connection: Connection) {
        connection;
    };
    private errorSwitchMethod: Function = function(errorString: string) {
    }

    constructor(serverAPI: ServerAPI, settings: SettingsManager) {
        this.serverAPI = serverAPI;
        this.language = new Language(this, settings);
    }

    async initLanguage() {
        await this.language.init()
    }

    getLanguage(): Language {
        return this.language;
    }

    async setConnectionInfoRefresh(connectionRefreshMethod: Function) {
        this.connectionRefreshMethod = connectionRefreshMethod;
    }

    async setErrorSwitchMethod(errorSwitchMethod: Function) {
        this.errorSwitchMethod = errorSwitchMethod;
    }

    async triggerErrorSwitch(errorString: string) {
        this.errorSwitchMethod(errorString);
    }

    async execute(command: string, args: {} = {}) {
        return await this.serverAPI.callPluginMethod(command, args);
    }

    async isInstalled(): Promise<boolean> {
        return this.cachedInstalled; 
    }

    async isLoggedIn(): Promise<boolean> {
        return this.cachedLoggedIn;
    }

    async getCountries(): Promise<string> {
        return this.cachedCountries;
    }

    async getCities(countryName: string): Promise<string> {
        return (await this.serverAPI.callPluginMethod("getCities", countryName)).result as string;
    }

    connect(countryName: string, cityName: string) {
        this.serverAPI.callPluginMethod("connect", {"countryName" : countryName, "cityName" : cityName}).then(() => {
            this.getConnection().then((response) => {
                this.connectionRefreshMethod(response);
            });
        });
    }

    async getVersion(): Promise<string> {
        return (await this.serverAPI.callPluginMethod("getVersion", {})).result as string;
    }

    async isConnected(): Promise<boolean> {
        return (await this.serverAPI.callPluginMethod("isConnected", {})).result as boolean;
    }

    async disconnect(): Promise<boolean> {
        return (await this.serverAPI.callPluginMethod("disconnect", {})).success;
    }

    async autoConnect(): Promise<boolean> {
        return (await this.serverAPI.callPluginMethod("autoConnect", {})).success;
    }

    async getFirewall(): Promise<boolean> {
        return (await this.serverAPI.callPluginMethod("getFirewall", {})).result as boolean;
    }

    async getRouting(): Promise<boolean> {
        return (await this.serverAPI.callPluginMethod("getRouting", {})).result as boolean;
    }

    async getAnalytics(): Promise<boolean> {
        return (await this.serverAPI.callPluginMethod("getAnalytics", {})).result as boolean;
    }

    async getKillSwitch(): Promise<boolean> {
        return (await this.serverAPI.callPluginMethod("getKillSwitch", {})).result as boolean;
    }

    async getThreatProtectionLite(): Promise<boolean> {
        return (await this.serverAPI.callPluginMethod("getThreatProtectionLite", {})).result as boolean;
    }

    async getNotify(): Promise<boolean> {
        return (await this.serverAPI.callPluginMethod("getNotify", {})).result as boolean;
    }

    async getAutoConnect(): Promise<boolean> {
        return (await this.serverAPI.callPluginMethod("getAutoConnect", {})).result as boolean;
    }

    async getIPv6(): Promise<boolean> {
        return (await this.serverAPI.callPluginMethod("getIPv6", {})).result as boolean;
    }

    async getLanDiscovery(): Promise<boolean> {
        return (await this.serverAPI.callPluginMethod("getLanDiscovery", {})).result as boolean;
    }

    async setFirewall(state: boolean): Promise<boolean> {
        return (await this.serverAPI.callPluginMethod("setFirewall", {state})).success;
    }

    async setRouting(state: boolean): Promise<boolean> {
        return (await this.serverAPI.callPluginMethod("setRouting", {state})).success;
    }

    async setAnalytics(state: boolean): Promise<boolean> {
        return (await this.serverAPI.callPluginMethod("setAnalytics", {state})).success;
    }

    async setKillSwitch(state: boolean): Promise<boolean> {
        return (await this.serverAPI.callPluginMethod("setKillSwitch", {state})).success;
    }

    async setThreatProtectionLite(state: boolean): Promise<boolean> {
        return (await this.serverAPI.callPluginMethod("setThreatProtectionLite", {state})).success;
    }

    async setNotify(state: boolean): Promise<boolean> {
        return (await this.serverAPI.callPluginMethod("setNotify", {state})).success;
    }

    async setAutoConnect(state: boolean): Promise<boolean> {
        return (await this.serverAPI.callPluginMethod("setAutoConnect", {state})).success;
    }

    async setIPv6(state: boolean): Promise<boolean> {
        return (await this.serverAPI.callPluginMethod("setIPv6", {state})).success;
    }

    async setLanDiscovery(state: boolean): Promise<boolean> {
        return (await this.serverAPI.callPluginMethod("setLanDiscovery", {state})).success;
    }

    async resetDefaults(): Promise<boolean> {
        return (await this.serverAPI.callPluginMethod("resetDefaults", {})).success;
    }

    async getEmail(): Promise<string> {
        return (await this.serverAPI.callPluginMethod("getEmail", {})).result as string;
    }

    async isSubscriptionActive(): Promise<boolean> {
        return (await this.serverAPI.callPluginMethod("isSubscriptionActive", {})).result as boolean;
    }

    async getSubscriptionExpireDate(): Promise<string> {
        return (await this.serverAPI.callPluginMethod("getSubscriptionExpireDate", {})).result as string;
    }

    async logout(): Promise<boolean> {
        return (await this.serverAPI.callPluginMethod("logout", {})).success;
    }

    async login(): Promise<string> {
        return (await this.serverAPI.callPluginMethod("login", {})).result as string;
    }

    async loginCallback(url: any): Promise<string> {
        return (await this.serverAPI.callPluginMethod("loginCallback", {"url": url})).result as string
    }

    async getConnection(): Promise<Connection> {
        return (await this.serverAPI.callPluginMethod("getConnection", {})).result as Connection;
    }

    async refreshCache() {
        this.cachedInstalled = (await this.serverAPI.callPluginMethod("isInstalled", {})).result as boolean;
        this.cachedLoggedIn = (await this.serverAPI.callPluginMethod("isLoggedIn", {})).result as boolean;
        this.cachedCountries = (await this.serverAPI.callPluginMethod("getCountries", {})).result as string;
    }
}