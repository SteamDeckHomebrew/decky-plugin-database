import { ReactElement, useEffect, useState } from "react";
import { Backend, Connection, } from "../backend";
import { Field, PanelSection, PanelSectionRow, Spinner } from "decky-frontend-lib";

export function ConnectionInfo({backend}: {backend: Backend}): ReactElement {
    const [ connection, setConnection ] = useState<Connection>();
    const [ loaded, setLoaded ] = useState(false); 

    function refreshConnectionInfo(connection: Connection) {
        setConnection(connection);
    }

    backend.setConnectionInfoRefresh(refreshConnectionInfo);

    const init = async() => {
        refreshConnectionInfo(await backend.getConnection());

        setLoaded(true);
    }

    useEffect(() => {
        init()
    }, []);

    if(!loaded) {
        return (
            <PanelSection title={backend.getLanguage().translate("ui.connectioninfo.title")}>
                <PanelSectionRow>
                    <Field label={backend.getLanguage().translate("general.loading")}>
                        <Spinner />
                    </Field>
                </PanelSectionRow>
            </PanelSection>
        )
    }

    return (
        <PanelSection title={backend.getLanguage().translate("ui.connectioninfo.title")}>
            <PanelSectionRow>
                <Field
                label={backend.getLanguage().translate("ui.connectioninfo.status")}
                >{backend.getLanguage().translate(String(connection?.Status))}</Field>    
            </PanelSectionRow>
            {(connection?.Status === "ui.connectioninfo.connected") && 
                <>
                <PanelSectionRow>
                <Field
                label={backend.getLanguage().translate("ui.connectioninfo.country")}
                >{connection?.Country}</Field>
                </PanelSectionRow>
                <PanelSectionRow>
                <Field
                label={backend.getLanguage().translate("ui.connectioninfo.city")}
                >{connection?.City}</Field>
                </PanelSectionRow>
                <PanelSectionRow>
                <Field
                label={backend.getLanguage().translate("ui.connectioninfo.ip")}
                >{connection?.IP}</Field>
                </PanelSectionRow>
                </>}
        </PanelSection>
    );
}