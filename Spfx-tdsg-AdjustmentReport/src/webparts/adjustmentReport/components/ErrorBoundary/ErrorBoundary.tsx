import * as React from "react";
import { Component, ErrorInfo, ReactNode } from "react";
import { redirectToHome } from "../../utils/utility";

interface ErrorBoundaryProps {
  children?: ReactNode;
}

interface ErrorBoundaryState {
  hasError: boolean;
}

class ErrorBoundary extends Component<ErrorBoundaryProps, ErrorBoundaryState> {
  public state: ErrorBoundaryState = {
    hasError: false,
  };

  public static getDerivedStateFromError(_: Error): ErrorBoundaryState {
    // Update state so the next render will show the fallback UI.
    return { hasError: true };
  }

  public componentDidCatch(error: Error, errorInfo: ErrorInfo): void {
    console.error("Uncaught error:", error, errorInfo);
  }

  public render(): ReactNode {
    if (this.state.hasError) {
      return (
        <div className="error-bounday">
          <img
            src={require("../../assets/picture_apology.png")}
            alt="Apologetic image"
            className="d-inline-block align-text-top"
          />
          <p className="mb-0 fw-semibold font-20 text-black">
            Oops! Something went wrong..!!
          </p>
          <p>Please contact your administrator if the problem persists.</p>
          <p>
            <span
              onClick={() => redirectToHome()}
              className="cursor-pointer text-danger text-decoration-underline"
            >
              Click Here
            </span>{" "}
            to go to homepage.
          </p>
        </div>
      );
    }

    return this.props.children;
  }
}

export default ErrorBoundary;
