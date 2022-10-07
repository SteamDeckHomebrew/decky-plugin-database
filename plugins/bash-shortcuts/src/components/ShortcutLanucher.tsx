import { DialogButton, Field, Focusable, gamepadDialogClasses } from "decky-frontend-lib";
import { Fragment } from "react";
import { Shortcut } from "../lib/data-structures/Shortcut";

import { IoRocketSharp } from "react-icons/io5";
import { ShortcutManager } from "../lib/ShortcutManager";
import { showToast } from "./utils/Toast";
import { useShortcutsState } from "../state/ShortcutsState";

export type ShortcutLauncherProps = {
    shortcut: Shortcut
}

export function ShortcutLauncher(props: ShortcutLauncherProps) {
    const {setIsRunning} = useShortcutsState();

    async function runShortcut(shortcut:Shortcut) {
        const res = await ShortcutManager.launchShortcut(shortcut, setIsRunning);
        if (!res) {
            showToast("Shortcut failed. Check the associated command.");
        }
    }

    return (
        <>
            <style>
                {`
                    .custom-buttons {
                        width: inherit;
                        height: inherit;
                        display: inherit;
                    }

                    .custom-buttons .${gamepadDialogClasses.FieldChildren} {
                        margin: 0px 16px;
                    }
                `}
            </style>
            <div className="custom-buttons">
                <Field label={props.shortcut.name}>
                    <Focusable style={{ display: "flex", width: "100%" }}>
                        <DialogButton onClick={() => runShortcut(props.shortcut)} style={{
                            minWidth: "30px",
                            maxWidth: "60px",
                            display: "flex",
                            justifyContent: "center",
                            alignItems: "center"
                        }}>
                            <IoRocketSharp />
                        </DialogButton>
                    </Focusable>
                </Field>
            </div>
        </>
    );
}