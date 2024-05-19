import {
  definePlugin,
  PanelSection,
  PanelSectionRow,
  ServerAPI,
  quickAccessMenuClasses,
  ButtonItem,
  Router,
  Navigation,
  QuickAccessTab,
  TextField
} from "decky-frontend-lib";
import { 
  VFC,
  useState
} from "react";
import { Backend } from "./backend";
import { GenIcon, IconBaseProps } from "react-icons";
import { ConnectionInfo } from "./components/connectionInfo";
import { Connect } from "./components/connect";
import { Settings } from "./components/settings";
import { SettingsManager } from "./settings";
import { 
  showDialog
} from "./utils";

function NordVPNfa(props: IconBaseProps) {
  // @ts-ignore
  return GenIcon({"tag":"svg","attr":{"viewBox":"0 0 48 48"},"child":[{"tag":"path","attr":{"d":"m6.59 36.89a21.71 21.71 0 0 1 17.41-34.39 21.71 21.71 0 0 1 17.41 34.39l-10.33-16.89-1.86 3.17 1.88 3.23-7.1-12.23-5.27 9 1.9 3.27-3.72-6.44z"}}]})(props); 
}

const Content: VFC<{ backend: Backend, settings: SettingsManager }> = ({backend, settings}) => {

  const [ loaded, setLoaded ] = useState(false);
  const [ installed, setInstalled ] = useState(false);
  const [ loggedIn, setLoggedIn ] = useState(false);
  const [ errorSwitch, setErrorSwitch ] = useState(false);
  const [ errorString, setErrorString ] = useState("");

  const loadNordVPN = async () => {

    try {
      const isInstalledResponse = backend.isInstalled();
      setInstalled(await isInstalledResponse);
    } catch(error) {
      triggerErrorSwitch(String(error));
    }

    try {
      const isLoggedInResponse = backend.isLoggedIn();
      setLoggedIn(await isLoggedInResponse);
    } catch (error) {
      triggerErrorSwitch(String(error));
    }
    
    await backend.initLanguage();

    setLoaded(true);
  }

  function triggerErrorSwitch(errorString: string) {
    setErrorString(errorString);
    setErrorSwitch(true);
  }

  backend.setErrorSwitchMethod(triggerErrorSwitch);

  loadNordVPN();
  
  if(errorSwitch) {
    return (
    <>
    <p>{backend.getLanguage().translate("ui.error.switch1")}</p>
    <p>{backend.getLanguage().translate("ui.error.switch2")}</p>
    <p>{backend.getLanguage().translate("ui.error.switch3")}</p>
    <p>{backend.getLanguage().translate("ui.error.switch4")}{errorString}</p>
    </>)
  }

  if(loaded && !installed) {
    return (
    <PanelSection title={backend.getLanguage().translate("general.error")}>
      <PanelSectionRow>
        <a>Take a photo of this ;)</a>
        <br/>
        <a>To install NordVPN:</a>
        <br/>
        <a>1. Go into desktop mode</a>
        <br/>
        <a>2. Open Konsole</a>
        <br/>
        <a>3. Enter this: cd /home/deck/homebrew/plugins/NordVPNdeck/extensions</a>
        <br/>
        <a>4: Enter this: sudo chmod +x install.sh</a>
        <br/>
        <a>5. Enter this: ./install.sh</a>
        <br/>
        <a>6. Restart the SteamDeck</a>
      </PanelSectionRow>
      </PanelSection>);
  }

  if(loaded && !loggedIn) {
    return (<>
    <PanelSection title={backend.getLanguage().translate("ui.login.title")}>
      <PanelSectionRow>
        <a>Take a photo of this ;)</a>
        <br/>
        <a>To login into NordVPN:</a>
        <br/>
        <a>1. Go into desktop mode</a>
        <br/>
        <a>2. Open Konsole</a>
        <br/>
        <a>3. Enter this: nordvpn login</a>
        <br/>
        <a>4. Copy the url after: continue in the browser</a>
        <br/>
        <a>5. Paste the url in a browser</a>
        <br/>
        <a>6. Follow the instructions</a>
        <br/>
        <a>7. Success you are now logged in</a>
        <br/>
        <a>8. Switch back to game mode</a>
      </PanelSectionRow>
    </PanelSection>
    </>);
  }

  if(loaded && installed && loggedIn) {
    return (
    <>
    <ConnectionInfo backend={backend} /> 
    <Connect backend={backend} />
    <Settings settings={settings} backend={backend} /> 
    </>);
  }

  if(!loaded) {
    return (<p>{"Initializing..."}</p>);
  }

  return (
    <>
    <p>{backend.getLanguage().translate("general.error.unknown")}</p>
    </>
  );
};

export default definePlugin((serverApi: ServerAPI) => {
  var settings = new SettingsManager(serverApi); 
  var backend = new Backend(serverApi, settings);
  backend.refreshCache();

  return {
    title: <div className={quickAccessMenuClasses.Title}>NordVPNdeck</div>,
    content: <Content settings={settings} backend={backend} />,
    icon: <NordVPNfa/>
  };
});
