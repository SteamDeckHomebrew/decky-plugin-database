import { findModuleChild } from "decky-frontend-lib";
import { useEffect, useState, VFC } from "react";

enum UIComposition {
  Hidden = 0,
  Notification = 1,
  Overlay = 2,
  Opaque = 3,
  OverlayKeyboard = 4,
}

type UseUIComposition = (composition: UIComposition) => {
  releaseComposition: () => void;
};

const useUIComposition: UseUIComposition = findModuleChild((m) => {
  if (typeof m !== "object") return undefined;
  for (let prop in m) {
    if (
      typeof m[prop] === "function" &&
      m[prop].toString().includes("AddMinimumCompositionStateRequest") &&
      m[prop].toString().includes("ChangeMinimumCompositionStateRequest") &&
      m[prop].toString().includes("RemoveMinimumCompositionStateRequest") &&
      !m[prop].toString().includes("m_mapCompositionStateRequests")
    ) {
      return m[prop];
    }
  }
});

const UICompositionProxy: VFC = () => {
  useUIComposition(UIComposition.Notification);
  return null;
};

const Overlay = ({ opacity = 0.5, backgroundColor = 'black' }) => {
  return (<div
    id="brightness_bar_container"
    style={{
      left: 0,
      top: 0,
      width: "100vw",
      height: "100vh",
      background: backgroundColor,
      zIndex: 7001, // volume bar is 7000
      position: "fixed",
      opacity,
      pointerEvents: "none"
    }}
  >
    <UICompositionProxy />
  </div>)
};

export default Overlay;