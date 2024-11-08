import * as React from "react";
import styles from "./EquipmentReport.module.scss";
import type { IEquipmentReportProps } from "./IEquipmentReportProps";
import { HashRouter, Navigate, Route, Routes } from "react-router-dom";
import EquipmentReportLayout from "./pages/EquipmentReportLayout";
import Dashboard from "./pages/Dashboard";
import { UserProvider } from "../context/userContext";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { WebPartContext } from "../context/webpartContext";
import NotFound from "./pages/NotFound";

const queryClient = new QueryClient({
  defaultOptions: { queries: { retry: false, refetchOnWindowFocus: false } },
});

export default class EquipmentReport extends React.Component<IEquipmentReportProps> {
  public render(): React.ReactElement<IEquipmentReportProps> {
    const { userEmail, context } = this.props;
  
    return (
      <QueryClientProvider client={queryClient}>
        <WebPartContext.Provider value={context}>
          <UserProvider userEmail={userEmail}>
            <HashRouter>
              <Routes>
                <Route
                  path="/equipment-improvement-report"
                  element={
                    <Navigate to="/" replace />
                  }
                />
                <Route
                  path="/"
                  element={<Dashboard />}
                />
                <Route
                  path="/form/:mode?/:id?"
                  element={<EquipmentReportLayout />}
                />
                <Route path="*" element={<NotFound />} />
              </Routes>
            </HashRouter>
          </UserProvider>
        </WebPartContext.Provider>
      </QueryClientProvider>
    );
  }
}
