import { createContext, FC, useContext, useEffect, useState } from "react";
import { Shortcut } from "../lib/data-structures/Shortcut"

type ShortcutsDictionary = {
    [key:string]: Shortcut
}

interface PublicShortcutsState {
    shortcuts: ShortcutsDictionary;
    shortcutsList: Shortcut[];
    isRunning: boolean;
}

interface PublicShortcutsContext extends PublicShortcutsState {
    setShortcuts(shortcuts: ShortcutsDictionary): void;
    setIsRunning(value: boolean): void;
}

export class ShortcutsState {
    private shortcuts: ShortcutsDictionary = {};
    private shortcutsList: Shortcut[] = [];
    private isRunning: boolean = false;

    public eventBus = new EventTarget();

    getPublicState() {
        return {
            "shortcuts": this.shortcuts,
            "shortcutsList": this.shortcutsList,
            "isRunning": this.isRunning
        }
    }

    setShortcuts(shortcuts: ShortcutsDictionary) {
        this.shortcuts = shortcuts;
        this.shortcutsList = Object.values(this.shortcuts).sort((a, b) => a.position - b.position);
        this.forceUpdate();
    }

    setIsRunning(value: boolean) {
        this.isRunning = value;
        this.forceUpdate();
    }

    private forceUpdate() {
        this.eventBus.dispatchEvent(new Event("stateUpdate"));
    }
}

const ShortcutsContext = createContext<PublicShortcutsContext>(null as any);
export const useShortcutsState = () => useContext(ShortcutsContext);

interface ProviderProps {
    shortcutsStateClass: ShortcutsState
}

export const ShortcutsContextProvider: FC<ProviderProps> = ({
    children,
    shortcutsStateClass
}) => {
    const [publicState, setPublicState] = useState<PublicShortcutsState>({
        ...shortcutsStateClass.getPublicState()
    });

    useEffect(() => {
        function onUpdate() {
            setPublicState({ ...shortcutsStateClass.getPublicState() });
        }

        shortcutsStateClass.eventBus
            .addEventListener("stateUpdate", onUpdate);

        return () => {
            shortcutsStateClass.eventBus
                .removeEventListener("stateUpdate", onUpdate);
        }
    }, []);

    const setShortcuts = (shortcuts: ShortcutsDictionary) => {
        shortcutsStateClass.setShortcuts(shortcuts);
    }

    const setIsRunning = (value: boolean) => {
        shortcutsStateClass.setIsRunning(value);
    }

    return (
        <ShortcutsContext.Provider
            value={{
                ...publicState,
                setShortcuts,
                setIsRunning
            }}
        >
            {children}
        </ShortcutsContext.Provider>
    )
}