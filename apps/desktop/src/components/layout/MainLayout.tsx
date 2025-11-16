import { Panel, PanelGroup, PanelResizeHandle } from "react-resizable-panels";

import { useLayout } from "../../contexts/LayoutContext";
import { BottomPanel } from "./BottomPanel";
import { Sidebar } from "./Sidebar";
import { StatusBar } from "./StatusBar";
import { TabArea } from "./TabArea";

export function MainLayout() {
  const { sidebarCollapsed } = useLayout();

  return (
    <div className="app-shell">
      <div className="workspace-grid">
        <PanelGroup autoSaveId="neuralyn.horizontal" direction="horizontal">
          <Panel
            className="layout-panel"
            collapsedSize={4}
            collapsible
            defaultSize={sidebarCollapsed ? 6 : 22}
            maxSize={35}
            minSize={15}
          >
