import english from "../../assets/language/en.json"
import german from "../../assets/language/de.json"
import { Backend } from "../backend";
import { SettingsManager } from "../settings";

export interface LanguageModule {
    translate(name: string): string;
}

export class LanguageDefinition {
    public code: string;
    public fullName: string;
    public handle: any;
    
    constructor(code: string, fullName: string, handle: any) {
        this.code = code;
        this.fullName = fullName;
        this.handle = handle;
    }
}

export class Language {
    private language: LanguageModule = {
        translate(name: string): string {
            return name
        }
    }
    private backend: Backend;
    private settings: SettingsManager;
    private availableLanguages: LanguageDefinition[] =  [
        new LanguageDefinition("en", "English", english),
        new LanguageDefinition("de", "German", german)
    ]
    
    constructor(backend: Backend, settings: SettingsManager) {
        this.backend = backend;
        this.settings = settings;
    }  

    async init() {
        if(Boolean(await this.settings.getSetting("manuallanguage", false))) {
            var selectedLangauge = await this.settings.getSetting("language", "unknown");
            var upper: Language = this;
            for(var language of this.availableLanguages) {
                if(language.code === selectedLangauge) {
                    upper.language = {
                        translate(name: string): string {
                            return language.handle[name]
                        }
                    }
                    return;
                }
            }
            return;
        }
        for (var language of this.availableLanguages) {
            if(language.code === navigator.language.split("-")[0].toLocaleLowerCase()) {
                this.language = {
                    translate(name: string): string {
                        return language.handle[name]
                    }
                }
                return
            }
        }
        this.backend.triggerErrorSwitch("Invalid language: '" + navigator.language.split("-")[0].toLocaleLowerCase() + "'")
    }

    translate(name: string): string {
        return this.language.translate(name);
    }

    getAvailableLanguages(): LanguageDefinition[] {
        return this.availableLanguages;
    }
}