import {
  ButtonItem,
  definePlugin,
  gamepadDialogClasses,
  PanelSection,
  PanelSectionRow,
  quickAccessControlsClasses,
  Router,
  ServerAPI,
  SidebarNavigation,
  staticClasses,
} from "decky-frontend-lib";
import { VFC, Fragment } from "react";
import { IoApps } from "react-icons/io5";
import { About } from "./components/shortcuts-manager/About";
import { AddShortcut } from "./components/shortcuts-manager/AddShortcut";
import { ShortcutLauncher } from "./components/ShortcutLanucher";
import { ManageShortcuts } from "./components/shortcuts-manager/ManageShortcuts";

import { PyInterop } from "./PyInterop";
import { Shortcut } from "./lib/data-structures/Shortcut";
import { ShortcutsContextProvider, ShortcutsState, useShortcutsState } from "./state/ShortcutsState";
import { ShortcutManager } from "./lib/ShortcutManager";

type ShortcutsDictionary = {
  [key:string]: Shortcut
}

const Content: VFC<{ serverAPI: ServerAPI }> = ({}) => {
  const {shortcuts, setShortcuts, shortcutsList, isRunning} = useShortcutsState();

  async function reload() {
    await PyInterop.getShortcuts().then((res) => {
      setShortcuts(res.result as ShortcutsDictionary);
    });
  }
  
  if (Object.values(shortcuts as ShortcutsDictionary).length === 0) {
    reload();
  }

  return (
    <>
      <style>{`
        .scope {
          width: inherit;
          height: inherit;
          display: inherit;

          flex: 1 1 1px;
          min-height: 1px;
          scroll-padding: 48px 0px;
          display: flex;
          flex-direction: column;
          justify-content: flex-start;
          align-content: stretch;
        }
        .scope .${quickAccessControlsClasses.PanelSection} {
          padding: 0px;
        }

        .scope .${gamepadDialogClasses.FieldChildren} {
          margin: 0px 16px;
        }
        
        .scope .${gamepadDialogClasses.FieldLabel} {
          margin-left: 16px;
        }
      `}</style>
      <div className="scope">
        <PanelSection>
          <PanelSectionRow>
            <ButtonItem layout="below" onClick={() => { Router.CloseSideMenus(); Router.Navigate("/shortcuts-nav"); }} >
              Manage Shortcuts
            </ButtonItem>
          </PanelSectionRow>

          {
            (isRunning) ? (
              <>
                <div style={{
                    textAlign: "center",
                    margin: "14px 0px",
                    padding: "0px 15px",
                    fontSize: "18px"
                }}>A shortcut is running. Please close before running another.</div>
                <ButtonItem layout="below" onClick={async () => {
                  const status = await ShortcutManager.closeGame();
                  if (status) {
                    Router.CloseSideMenus();
                  }
                }} >
                  Close Shortcut
                </ButtonItem>
              </>
            ) : (
              <>
                {
                  shortcutsList.map((itm: Shortcut) => (
                    <ShortcutLauncher shortcut={itm} />
                  ))
                }
                <PanelSectionRow>
                  <ButtonItem layout="below" onClick={reload} >
                    Reload
                  </ButtonItem>
                </PanelSectionRow>
              </>
            )
          }
        </PanelSection>
      </div>
    </>
  );
};

const ShortcutsManagerRouter: VFC = () => {
  return (
    <SidebarNavigation
      title="Shortcuts Manager"
      showTitle
      pages={[
        {
          title: "Add a Shortcut",
          content: <AddShortcut />,
          route: "/shortcuts-nav/add",
        },
        {
          title: "Manage Shortcuts",
          content: <ManageShortcuts />,
          route: "/shortcuts-nav/manage",
        },
        {
          title: "About Shortcuts",
          content: <About />,
          route: "/shortcuts-nav/about",
        },
      ]}
    />
  );
};

export default definePlugin((serverApi: ServerAPI) => {
  PyInterop.setServer(serverApi);

  const state = new ShortcutsState();
  ShortcutManager.setServer(serverApi);
  ShortcutManager.init("Bash Shortcuts");

  serverApi.routerHook.addRoute("/shortcuts-nav", () => (
    <ShortcutsContextProvider shortcutsStateClass={state}>
      <ShortcutsManagerRouter />
    </ShortcutsContextProvider>
  ));

  return {
    title: <div className={staticClasses.Title}>Bash Shortcuts</div>,
    content: (
      <ShortcutsContextProvider shortcutsStateClass={state}>
        <Content serverAPI={serverApi} />
      </ShortcutsContextProvider>
    ),
    icon: <IoApps />,
    onDismount() {
      serverApi.routerHook.removeRoute("/shortcuts-nav");
      ShortcutManager.onDismount();
    },
  };
});
