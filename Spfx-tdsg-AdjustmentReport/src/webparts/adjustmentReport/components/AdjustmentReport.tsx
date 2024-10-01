import * as React from "react";
import type { IAdjustmentReportProps } from "./IAdjustmentReportProps";
import { WebPartContext } from "../context/WebPartContext";
import { Route, HashRouter as Router, Routes } from "react-router-dom";
import AdjustmentReportMain from "./pages/adjustmentReport/AdjustmentReportMain";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { ConfigProvider } from "antd";
import PageLayout from "./pageLayout/PageLayout";
import ReportFormPage from "./pages/AdjustmentRequest/ReportFormPage";

const queryClient = new QueryClient({
  defaultOptions: { queries: { retry: false, refetchOnWindowFocus: false } },
});

const AdjustmentReport: React.FC<IAdjustmentReportProps> = ({
  description,
  isDarkTheme,
  environmentMessage,
  hasTeamsContext,
  userDisplayName,
  context,
  userEmail,
}) => {
  return (
    <WebPartContext.Provider value={context}>
      <QueryClientProvider client={queryClient}>
        <ConfigProvider
          theme={{
            token: {
              colorTextDisabled: "var(--color-disabled-text)",
              colorPrimary: "#c50017",
            },
          }}
        >
          <Router>
            <PageLayout title="Adjustment Report">
              <Routes>
                <Route path="/" element={<AdjustmentReportMain />} />
                <Route path="/form/:mode/:id?" element={<ReportFormPage />} />
              </Routes>
            </PageLayout>
          </Router>
        </ConfigProvider>
      </QueryClientProvider>
    </WebPartContext.Provider>
  );
};

export default AdjustmentReport;
