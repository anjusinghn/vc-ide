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
