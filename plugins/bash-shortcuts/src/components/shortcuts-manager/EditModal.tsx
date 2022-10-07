import { Field, ConfirmModal, PanelSection, PanelSectionRow, TextField } from "decky-frontend-lib"
import { VFC, Fragment, useState } from "react"
import { Shortcut } from "../../lib/data-structures/Shortcut"

type EditModalProps = {
    closeModal: () => void,
    onConfirm?(shortcut:Shortcut): any,
    title?: string,
    shortcut: Shortcut,
}

export const EditModal: VFC<EditModalProps> = ({
    closeModal,
    onConfirm = () => {},
    shortcut,
    title = `Modifying: ${shortcut.name}`,
}) => {
    const [name, setName] = useState<string>(shortcut.name);
    const [cmd, setCmd] = useState<string>(shortcut.cmd);
    
    return (
        <>
            <ConfirmModal
            bAllowFullSize
            onCancel={closeModal}
            onEscKeypress={closeModal}
            
            onOK={() => {
                const updated = new Shortcut(shortcut.id, name, cmd, shortcut.position);
                onConfirm(updated);
                closeModal();
            }}>
                <PanelSection title={title}>
                    <PanelSectionRow>
                        <Field
                            label="Shortcut Name"
                            description={
                                <TextField
                                    label={'Name'}
                                    value={name}
                                    onChange={(e) => setName(e?.target.value)}
                                />}
                            />
                    </PanelSectionRow>
                    <PanelSectionRow>
                        <Field
                            label="Shortcut Command"
                            description={
                                <TextField
                                    label={'Command'}
                                    value={cmd}
                                    onChange={(e) => setCmd(e?.target.value)}
                                />}
                            />
                    </PanelSectionRow>
                </PanelSection>
            </ConfirmModal>
        </>
    )
}