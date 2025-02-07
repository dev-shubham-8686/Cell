import * as React from "react";
import type { IEquipmentReportProps } from "./IEquipmentReportProps";
import { HashRouter, Navigate, Route, Routes } from "react-router-dom";
import EquipmentReportLayout from "./pages/EquipmentReportLayout";
import Dashboard from "./pages/Dashboard";
import { UserProvider } from "../context/userContext";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { WebPartContext } from "../context/webpartContext";
import NotFound from "./pages/NotFound";
import MasterTab from "./pages/MasterIndex/MasterTab";
import AreaMasterPage from "./pages/MasterIndex/AreaMasterPage";
import MachineMasterPage from "./pages/MasterIndex/MachineMasterPage";
import SectionMasterPage from "./pages/MasterIndex/SectionMasterPage";
import SubMachineMasterPage from "./pages/MasterIndex/SubMachineMasterPage";
import ImpCategoryMasterPage from "./pages/MasterIndex/ImpCategoryMasterPage";
import ApprovalHome from "./common/ApprovalHome";

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
                 <Route
                      path="/form/:mode/:id/approval"
                      element={<ApprovalHome />}
                    />
                <Route path="/master" element={<MasterTab />} />
                    <Route path="/master/area" element={<AreaMasterPage />} />
                <Route path="/master/section" element={<SectionMasterPage />} />
                <Route path="/master/machine" element={<MachineMasterPage />} />
                <Route path="/master/submachine" element={<SubMachineMasterPage />} />
                <Route path="/master/impCategory" element={<ImpCategoryMasterPage />} />
                <Route path="*" element={<NotFound />} />
              </Routes> 
            </HashRouter>
          </UserProvider>
        </WebPartContext.Provider>
      </QueryClientProvider>
    );
  }
}
