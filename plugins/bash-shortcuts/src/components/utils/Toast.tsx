import { ModalRoot, showModal } from "decky-frontend-lib";
import { VFC, Fragment } from "react"

type ToastModalProps = {
    message: string,
    timeout: number,
    closeModal: () => void
}
const ToastModal: VFC<ToastModalProps> = ({
    message,
    timeout,
    closeModal,
}) => {

    setTimeout(() => {
        closeModal();
    }, timeout);
    
    return (
        <>
            <ModalRoot>{message}</ModalRoot>
        </>
    )
}

export function showToast(msg:string, timeout = 1500) {
    // @ts-ignore
    showModal(<ToastModal message={msg} timeout={timeout} />);
}