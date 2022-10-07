import { ButtonItem, ConfirmModal, DialogButton, Field, Focusable, Menu, MenuItem, showContextMenu, showModal, GamepadButton as DeckyGamepadButton, GamepadEvent as DeckyGamepadEvent } from "decky-frontend-lib";
import React, { Fragment, useEffect, useRef, useState } from "react";
import { PyInterop } from "../../PyInterop";
import { Shortcut } from "../../lib/data-structures/Shortcut";

import { FaEllipsisH, FaArrowsAltV } from "react-icons/fa";
import { EditModal } from "./EditModal";
import { useShortcutsState } from "../../state/ShortcutsState";

type ShortcutModProps = {
    shortcut: Shortcut,
    index: number
}

type ShortcutsDictionary = {
    [key:string]: Shortcut
}

const ELEM_HEIGHT = 32; //height of each ModShort element

export function ManageShortcuts() {
    let reorderEnabled = useRef(false);
    const touchOrigin = useRef({"x": -1, "y": -1});
    const mouseOrigin = useRef({"x": -1, "y": -1});
    let focusedSide = useRef(false); //false = left, true = right

    const [update, setUpdate] = useState(0);

    let focusIdx = useRef(0);

    const {shortcuts, setShortcuts, shortcutsList} = useShortcutsState();

    function enableReorder() {
        reorderEnabled.current = true;
    }

    function disabledReorder() {
        reorderEnabled.current = false;
    }

    function showMenu(e: MouseEvent, shortcut: Shortcut) {
        return showContextMenu(
            <Menu label="Actions" cancelText="Cancel" onCancel={() => {}}>
            <MenuItem onSelected={() => {showModal(
                // @ts-ignore
                <EditModal onConfirm={(updated:Shortcut) => {
                    PyInterop.modShortcut(updated);
                    let shorts = shortcuts;
                    shorts[shortcut.id] = updated;
                    setShortcuts(shorts);
                    reload();
                }} shortcut={shortcut} />
            )}}>Edit</MenuItem>
            <MenuItem onSelected={() => {showModal(
                <ConfirmModal onOK={() => {
                    PyInterop.remShortcut(shortcut);
                    let shorts = shortcuts;
                    delete shorts[shortcut.id];
                    setShortcuts(shorts);
                    reload();
                }} bDestructiveWarning={true}>
                    Are you sure you want to delete this shortcut?
                </ConfirmModal>
            )}}>Delete</MenuItem>
            </Menu>,
            e.currentTarget ?? window
        );
    }

    function forceUpdate() {
        setUpdate(update === 0 ? 1 : 0);
    }
    
    function ShortcutMod(props: ShortcutModProps) {
        const wrapperFocusable = useRef<HTMLDivElement>(null);
        const reorderBtn = useRef<HTMLDivElement>(null);
        const optionsBtn = useRef<HTMLDivElement>(null);

        let lastEvent = false;

        useEffect(() => {
            if (focusIdx.current === props.index) {
                if (!focusedSide.current) {
                    optionsBtn.current?.blur();
                    reorderBtn.current?.focus();
                } else {
                    reorderBtn.current?.blur();
                    optionsBtn.current?.focus();
                }
            }
        });

        function reorder(down:boolean) {
            if ((down && props.shortcut.position != shortcutsList.length) || (!down && props.shortcut.position != 1)) {
                const thisShortcut = props.shortcut;
                const previous = shortcutsList[down ? props.index+1 : props.index-1];
                const tmp = thisShortcut.position;
                thisShortcut.position = previous.position;
                previous.position = tmp;
    
                const refs = shortcuts;
                refs[thisShortcut.id] = thisShortcut;
                refs[previous.id] = previous;
    
                setShortcuts(refs);
                PyInterop.setShortcuts([thisShortcut, previous]);

                if (down) {
                    focusIdx.current++;
                } else {
                    focusIdx.current--;
                }
            }
        }

        return (
            <>
                <div className="custom-buttons">
                    <Field label={props.shortcut.name} onFocus={() => { focusIdx.current = props.index; }} ref={wrapperFocusable} style={{
                        width: "100%"
                    }}>
                        <Focusable
                            style={{
                                display: "flex",
                                width: "100%"
                            }}
                            onGamepadDirection={(e:DeckyGamepadEvent) => {
                                switch(e.detail.button) {
                                    case DeckyGamepadButton.DIR_DOWN: {
                                        
                                        if (reorderEnabled.current && props.shortcut.position === shortcutsList.length) {
                                            e.preventDefault();
                                            e.stopImmediatePropagation();
                                        }

                                        if (reorderEnabled.current && props.shortcut.position != shortcutsList.length) reorder(true);

                                        if (props.shortcut.position != shortcutsList.length) {
                                            focusIdx.current++;
                                            forceUpdate();
                                        }
                                        break;
                                    }
                                    case DeckyGamepadButton.DIR_UP: {
                                        if (reorderEnabled.current && props.shortcut.position === 1) {
                                            e.preventDefault();
                                            e.stopImmediatePropagation();
                                        }

                                        if (reorderEnabled.current && props.shortcut.position != 1) reorder(false);
                                        
                                        if (props.shortcut.position != 1) {
                                            focusIdx.current--;
                                            forceUpdate();
                                        }
                                        break;
                                    }
                                    case DeckyGamepadButton.DIR_LEFT: {
                                        lastEvent = true;
                                        if (focusedSide.current) {
                                            focusedSide.current = false;
                                        }
                                        reorderEnabled.current = false;
                                    }
                                    case DeckyGamepadButton.DIR_RIGHT: {
                                        if (!lastEvent) {
                                            if (!focusedSide.current) {
                                                focusedSide.current = true;
                                            }
                                            reorderEnabled.current = false;
                                        } else {
                                            lastEvent = false;
                                        }
                                    }
                                }
                                return false;
                            }}
                            onMouseMove={(e:React.MouseEvent<HTMLDivElement>) => {
                                // once user has moved height of an entry, swap
                                if (reorderEnabled.current) {
                                    const dy = e.clientY - mouseOrigin.current.y;
                                    if (Math.abs(dy) >= ELEM_HEIGHT) {
                                        reorder(dy > 0);
                                        mouseOrigin.current = {
                                            "x": e.clientX,
                                            "y": e.clientY,
                                        }
                                    }
                                }
                            }}
                            onTouchMove={(e:React.TouchEvent<HTMLDivElement>) => {
                                if (reorderEnabled.current) {
                                    const dy = e.touches[0].clientY - touchOrigin.current.y;
                                    if (Math.abs(dy) >= ELEM_HEIGHT) {
                                        reorder(dy > 0);
                                        touchOrigin.current = {
                                            "x": e.touches[0].clientX,
                                            "y": e.touches[0].clientY,
                                        }
                                    }
                                }
                            }}
                        >
                            <DialogButton
                                style={{
                                    marginRight: "14px",
                                    minWidth: "30px",
                                    maxWidth: "60px",
                                    display: "flex",
                                    justifyContent: "center",
                                    alignItems: "center"
                                }}
                                ref={reorderBtn}
                                // @ts-ignore
                                onOKActionDescription={"Hold to reorder shortcuts"}
                                onButtonDown={(e:DeckyGamepadEvent) => {
                                    switch(e.detail.button) {
                                        case DeckyGamepadButton.OK: {
                                            enableReorder();
                                        }
                                    }
                                }}
                                onButtonUp={(e:DeckyGamepadEvent) => {
                                    switch(e.detail.button) {
                                        case DeckyGamepadButton.OK: {
                                            disabledReorder();
                                        }
                                    }
                                }}
                                onMouseDown={(e:MouseEvent) => {
                                    mouseOrigin.current = {
                                        "x": e.clientX,
                                        "y": e.clientY,
                                    }
                                    enableReorder();
                                }}
                                onTouchStart={(e:TouchEvent) => {
                                    touchOrigin.current = {
                                        "x": e.touches[0].clientX,
                                        "y": e.touches[0].clientY,
                                    }
                                    enableReorder();
                                }}
                            >
                                <FaArrowsAltV />
                            </DialogButton>
                            <DialogButton
                                style={{
                                    minWidth: "30px",
                                    maxWidth: "60px",
                                    display: "flex",
                                    justifyContent: "center",
                                    alignItems: "center"
                                }}
                                onClick={(e:MouseEvent) => showMenu(e, props.shortcut)}
                                ref={optionsBtn}
                            >
                                <FaEllipsisH />
                            </DialogButton>
                        </Focusable>
                    </Field>
                </div>
            </>
        );
    }

    async function reload() {
        await PyInterop.getShortcuts().then((res) => { setShortcuts(res.result as ShortcutsDictionary); });
    }
      
    if (Object.values(shortcuts as ShortcutsDictionary).length === 0) reload();
    
    return (
        <>
            <style>{`
                .scoper {
                    width: 100%;
                    display: flex;
                    flex-direction: column;
                }
            `}</style>
            <div style={{
                marginBottom: "5px"
            }}>Here you can re-order or remove existing shortcuts</div>
            <div className="scoper"
            onMouseUp={() => {
                mouseOrigin.current = {
                    "x": -1,
                    "y": -1,
                }
                disabledReorder();
            }}
            onTouchEnd={() => {
                touchOrigin.current = {
                    "x": -1,
                    "y": -1,
                }
                disabledReorder();
            }}
            >
                {shortcutsList.length > 0 ?
                    shortcutsList.map((itm: Shortcut, i:number) => (
                        <ShortcutMod shortcut={itm} index={i} />
                    )) : (
                        <div style={{width: "100%", display: "flex", justifyContent: "center", alignItems: "center", padding: "5px"}}>
                            You don't have any shortcuts right now! You can create new shortcuts from the add menu to the left.
                        </div>
                    )
                }
                <ButtonItem layout="below" onClick={reload} bottomSeparator='none'>
                    Reload Shortcuts
                </ButtonItem>
            </div>
        </>
    );
}