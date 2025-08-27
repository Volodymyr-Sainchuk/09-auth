"use client";
import React, { ReactNode, ErrorInfo } from "react";

interface LayoutProps {
  children: ReactNode;
  type?: "sign-in" | "sign-up";
}

interface State {
  hasError: boolean;
  error: Error | null;
}

export default class AuthLayout extends React.Component<LayoutProps, State> {
  constructor(props: LayoutProps) {
    super(props);
    this.state = { hasError: false, error: null };
  }

  static getDerivedStateFromError(error: Error) {
    return { hasError: true, error };
  }

  componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    console.error("Error caught in AuthLayout:", error, errorInfo);
  }

  render() {
    const layoutClass = this.props.type ? `${this.props.type}-layout` : "auth-layout";

    return (
      <div className={layoutClass}>
        {this.state.hasError ? (
          <>
            <h2>Something went wrong.</h2>
            <pre>{this.state.error?.message}</pre>
          </>
        ) : (
          this.props.children
        )}
      </div>
    );
  }
}
