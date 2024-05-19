import { ReactElement, useEffect, useState } from "react";
import { Backend } from "../backend";
import { ButtonItem, Dropdown, Field, Navigation, PanelSection, PanelSectionRow, SingleDropdownOption, Spinner, ToggleField } from "decky-frontend-lib";
import { SettingsManager } from "../settings";

export function Settings({backend, settings}: {backend: Backend, settings: SettingsManager}): ReactElement {
    const [ firewall, setFirewall ] = useState(false);
    const [ routing, setRouting ] = useState(false);
    const [ analytics, setAnalytics ] = useState(false);
    const [ killswitch, setKillSwitch ] = useState(false);
    const [ threatprotection, setThreatProtection ] = useState(false);
    const [ notify, setNotify ] = useState(false);
    const [ autoconnect, setAutoConnect ] = useState(false);
    const [ ipv6, setIPv6 ] = useState(false);
    const [ landiscovery, setLanDiscovery ] = useState(false);
    const [ manualLanguage, setManualLanguage ] = useState(false);
    const [ language, setLanguage ] = useState("en");
    const [ languages, setLanguages ] = useState<SingleDropdownOption[]>([]);
    const [ loaded, setLoaded ] = useState(false);

    const loadSettings = async () => {
        setFirewall(await backend.getFirewall());
        setRouting(await backend.getRouting());
        setAnalytics(await backend.getAnalytics());
        setKillSwitch(await backend.getKillSwitch());
        setThreatProtection(await backend.getThreatProtectionLite());
        setNotify(await backend.getNotify());
        setAutoConnect(await backend.getAutoConnect());
        setIPv6(await backend.getIPv6());
        setLanDiscovery(await backend.getLanDiscovery());
        
        if(!await settings.settingExists("manuallanguage")) {
            if(!await settings.setSetting("manuallanguage", false)) {
                backend.triggerErrorSwitch("setSetting('manallanguage') failed");
            }
        }

        if(!await settings.settingExists("language")) {
            if(!await settings.setSetting("language", "en")) {
                backend.triggerErrorSwitch("setSetting('language') failed");
            }
        }
        
        setLanguage(await settings.getSetting("language", "en"))
        setManualLanguage(Boolean(await settings.getSetting("manuallanguage", false)))

        var languages: SingleDropdownOption[] = [];

        for(var language of backend.getLanguage().getAvailableLanguages()) {
            languages.push({
                data: language.code,
                label: <span>{language.fullName}</span>
            });
        }

        setLanguages(languages);

        setLoaded(true)
    };

    useEffect(() => {
        loadSettings();
    }, []);

    if(!loaded) {
        return(
        <>
        <PanelSection 
        title={backend.getLanguage().translate("ui.settings.title")}>
            <PanelSectionRow>
                <Field label={backend.getLanguage().translate("general.loading")}>
                    <Spinner />
                </Field>
            </PanelSectionRow>
        </PanelSection>
        </>
        );
    }

    return (
        <>
        <PanelSection 
        title={backend.getLanguage().translate("ui.settings.title")}>
            <PanelSectionRow>
                <ToggleField
                bottomSeparator="standard"
                checked={firewall}
                label={backend.getLanguage().translate("ui.settings.firewall.title")}
                description={backend.getLanguage().translate("ui.settings.firewall.description")}
                onChange={(checked: boolean) => {
                    backend.setFirewall(checked);
                }}
                />
           </PanelSectionRow>
           <PanelSectionRow>
                <ToggleField
                bottomSeparator="standard"
                checked={routing}
                label={backend.getLanguage().translate("ui.settings.routing.title")}
                description={backend.getLanguage().translate("ui.settings.routing.description")}
                onChange={(checked: boolean) => {
                    backend.setRouting(checked);
                }}
                />
           </PanelSectionRow>
           <PanelSectionRow>
                <ToggleField
                bottomSeparator="standard"
                checked={analytics}
                label={backend.getLanguage().translate("ui.settings.analytics.title")}
                description={backend.getLanguage().translate("ui.settings.analytics.description")}
                onChange={(checked: boolean) => {
                    backend.setAnalytics(checked);
                }}
                />
           </PanelSectionRow>
           <PanelSectionRow>
                <ToggleField
                bottomSeparator="standard"
                checked={killswitch}
                label={backend.getLanguage().translate("ui.settings.killswitch.title")}
                description={backend.getLanguage().translate("ui.settings.killswitch.description")}
                onChange={(checked: boolean) => {
                    backend.setKillSwitch(checked);
                }}
                />
           </PanelSectionRow>
           <PanelSectionRow>
                <ToggleField
                bottomSeparator="standard"
                checked={threatprotection}
                label={backend.getLanguage().translate("ui.settings.threatprotection.title")}
                description={backend.getLanguage().translate("ui.settings.threatprotection.description")}
                onChange={(checked: boolean) => {
                    backend.setThreatProtectionLite(checked);
                }}
                />
           </PanelSectionRow>
           <PanelSectionRow>
                <ToggleField
                bottomSeparator="standard"
                checked={notify}
                label={backend.getLanguage().translate("ui.settings.notify.title")}
                description={backend.getLanguage().translate("ui.settings.notify.description")}
                onChange={(checked: boolean) => {
                    backend.setNotify(checked);
                }}
                />
           </PanelSectionRow>
           <PanelSectionRow>
                <ToggleField
                bottomSeparator="standard"
                checked={autoconnect}
                label={backend.getLanguage().translate("ui.settings.autoconnect.title")}
                description={backend.getLanguage().translate("ui.settings.autoconnect.description")}
                onChange={(checked: boolean) => {
                    backend.setAutoConnect(checked);
                }}
                />
           </PanelSectionRow>
           <PanelSectionRow>
                <ToggleField
                bottomSeparator="standard"
                checked={ipv6}
                label={backend.getLanguage().translate("ui.settings.ipv6.title")}
                description={backend.getLanguage().translate("ui.settings.ipv6.description")}
                onChange={(checked: boolean) => {
                    backend.setIPv6(checked);
                }}
                />
           </PanelSectionRow>
           <PanelSectionRow>
                <ToggleField
                bottomSeparator="standard"
                checked={landiscovery}
                label={backend.getLanguage().translate("ui.settings.landiscovery.title")}
                description={backend.getLanguage().translate("ui.settings.landiscovery.description")}
                onChange={(checked: boolean) => {
                    backend.setLanDiscovery(checked)
                }}
                />
           </PanelSectionRow>
           <PanelSectionRow>
                <ToggleField
                bottomSeparator="standard"
                checked={manualLanguage}
                label={backend.getLanguage().translate("ui.settings.languagetoggle.title")}
                description={backend.getLanguage().translate("ui.settings.languagetoggle.description")}
                onChange={(checked: boolean) => {
                    setManualLanguage(checked);
                    settings.setSetting("manuallanguage", checked);
                    backend.getLanguage().init();
                }}
                />
           </PanelSectionRow>
           <PanelSectionRow>
            <Field
            disabled={!manualLanguage}
            label={backend.getLanguage().translate("ui.settings.language.title")}
            >
            <Dropdown 
            disabled={!manualLanguage}
            rgOptions={languages} 
            selectedOption={language} 
            onChange={(dropDown: SingleDropdownOption) => {
                settings.setSetting("language", dropDown.data);
                backend.getLanguage().init();
            }}
            />
            </Field>
           </PanelSectionRow>
           <PanelSectionRow>
            <ButtonItem
            layout="below"
            onClick={() => {
                const asyncLogout = async() => {
                    await backend.logout()
                    backend.refreshCache()
                    Navigation.NavigateBack()
                }
                asyncLogout()
            }}
            >
                {backend.getLanguage().translate("ui.settings.logout.title")}
            </ButtonItem>
           </PanelSectionRow>
        </PanelSection>
        </>
    )
}