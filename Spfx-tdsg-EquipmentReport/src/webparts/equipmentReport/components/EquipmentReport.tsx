import * as React from "react";
import styles from "./EquipmentReport.module.scss";
import type { IEquipmentReportProps } from "./IEquipmentReportProps";
import { HashRouter, Navigate, Route, Routes } from "react-router-dom";
import EquipmentReportLayout from "./pages/EquipmentReportLayout";
import Dashboard from "./pages/Dashboard";
import { UserProvider } from "../context/userContext";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { WebPartContext } from "../context/webpartContext";



const queryClient = new QueryClient({
  defaultOptions: { queries: { retry: false, refetchOnWindowFocus: false } },
});


export default class EquipmentReport extends React.Component<IEquipmentReportProps> {
  public render(): React.ReactElement<IEquipmentReportProps> {
    const {
      userEmail,context
    } = this.props;

    return (
      <QueryClientProvider client={queryClient}>
              <WebPartContext.Provider value={context}>

      <UserProvider userEmail={userEmail}>
      <HashRouter>
      <Routes>
        <Route
          path="/"
          element={<Navigate to="/equipment-improvement-report" replace />}
        />
        <Route path="/equipment-improvement-report" element={<Dashboard />} />
        <Route
          path="/equipment-improvement-report/form/:mode/:id?"
          element={
            <EquipmentReportLayout/>
          }
        />
      </Routes>
      </HashRouter>
      </UserProvider>
      </WebPartContext.Provider>

      </QueryClientProvider>
    );
  }
}
