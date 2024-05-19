import { ConfirmModal, showModal } from "decky-frontend-lib"


export function showDialog(title: string, message: string, okText: string = "Cancel", cancelText: string = "Ok") {
    showModal(
      <ConfirmModal
      strTitle={title}
      strDescription={message}
      strCancelButtonText={cancelText}
      strOKButtonText={okText}
      />
    )
}