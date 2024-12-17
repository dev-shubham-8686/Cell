import * as React from "react";
import type { IAdjustmentReportProps } from "./IAdjustmentReportProps";
import { WebPartContext } from "../context/WebPartContext";
import { ConfigProvider } from "antd";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import {
  HashRouter,
  Route,
  HashRouter as Router,
  Routes,
} from "react-router-dom";
import PageLayout from "./pageLayout/PageLayout";
import ReportFormPage from "./pages/AdjustmentRequest/ReportFormPage";
import AdjustmentReportMain from "./pages/adjustmentReport/AdjustmentReportMain";
import Test from "./pages/adjustmentReport/Test";
import { UserProvider } from "../context/UserContext";
import NotFound from "./common/NotFound";
import ErrorBoundary from "./ErrorBoundary/ErrorBoundary";

const queryClient = new QueryClient({
  defaultOptions: { queries: { retry: false, refetchOnWindowFocus: false } },
});

export default class AdjustmentReport extends React.Component<
  IAdjustmentReportProps,
  {}
> {
  public render(): React.ReactElement<IAdjustmentReportProps> {
    const {
      // description,
      // isDarkTheme,
      // environmentMessage,
      // hasTeamsContext,
      // userDisplayName,
      context,
      userEmail,
    } = this.props;
    document.addEventListener("copy", (e) => {
      if (typeof window !== "undefined" && window !== null) {
        const selection = window.getSelection()?.toString().trim() || "";

        // Check if clipboardData is not null before using it
        if (e.clipboardData) {
          e.clipboardData.setData("text/plain", selection);
          e.preventDefault();
        }
      }
    });
    return (
      <ErrorBoundary>
        <WebPartContext.Provider value={context}>
          <QueryClientProvider client={queryClient}>
            <UserProvider userEmail={userEmail}>
              <ConfigProvider
                theme={{
                  token: {
                    colorTextDisabled: "var(--color-disabled-text)",
                    colorPrimary: "#c50017",
                  },
                }}
              >
                <HashRouter>
                  <Routes>
                    s <Route path="/" element={<AdjustmentReportMain />} />
                    <Route path="/test" element={<Test />} />
                    <Route
                      path="/form/:mode/:id?"
                      element={<ReportFormPage />}
                    />
                    <Route path="*" element={<NotFound />} />
                  </Routes>
                </HashRouter>

                {/* <h1>HELLO</h1> */}
              </ConfigProvider>
            </UserProvider>
          </QueryClientProvider>
        </WebPartContext.Provider>
      </ErrorBoundary>
    );
  }
}
