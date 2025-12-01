import { AlertTriangle } from "lucide-react";
import type { ErrorInfo, ReactNode } from "react";
import { Component } from "react";

type ErrorBoundaryProps = {
  children: ReactNode;
};

type ErrorBoundaryState = {
  error?: Error;
};

export class ErrorBoundary extends Component<ErrorBoundaryProps, ErrorBoundaryState> {
  public override state: ErrorBoundaryState = {};

  public static getDerivedStateFromError(error: Error): ErrorBoundaryState {
    return { error };
  }

  public override componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    console.error("Neuralyn render error", error, errorInfo);
  }

  public override render() {
    if (!this.state.error) {
      return this.props.children;
    }

    return (
      <div className="dark h-full">
        <div
          className="empty-state"
          style={{
            display: "flex",
            flexDirection: "column",
            gap: 12,
          }}
        >
          <div
            style={{
              alignItems: "center",
              background: "oklch(0.45 0.2 27 / 0.15)",
              border: "1px solid oklch(0.45 0.2 27 / 0.35)",
              borderRadius: 12,
              color: "oklch(0.82 0.12 27)",
              display: "inline-flex",
              height: 44,
              justifyContent: "center",
              width: 44,
            }}
          >
            <AlertTriangle size={20} />
          </div>
          <div style={{ display: "grid", gap: 4, maxWidth: 360 }}>
            <strong style={{ color: "var(--foreground)", fontSize: 16 }}>Workspace crashed</strong>
            <span className="muted" style={{ fontSize: 12, lineHeight: 1.5 }}>
              {this.state.error.message || "A rendering error interrupted the workspace."}
            </span>
          </div>
          <button
            className="small-action active"
            onClick={() => window.location.reload()}
            type="button"
          >
            Reload
          </button>
        </div>
      </div>
    );
  }
}
