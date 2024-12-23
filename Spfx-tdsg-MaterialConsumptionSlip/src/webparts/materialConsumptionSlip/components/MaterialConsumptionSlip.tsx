import * as React from "react";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { HashRouter, Navigate, Route, Routes } from "react-router-dom";

import MaterialConsumptionSlips from "./pages/materialConsumptionSlip";
import CreateEditMaterialConsumptionSlipLayout from "./pages/materialConsumptionSlip/createEditMaterialConsumptionSlipLayout";
import { UserProvider } from "../context/userContext";
import { IMaterialConsumptionSlipProps } from "./IMaterialConsumptionSlipProps";
import { WebPartContext } from "../context/webpartContext";
import { SPComponentLoader } from "@microsoft/sp-loader";
import { WEB_URL } from "../GLOBAL_CONSTANT";
import NotFound from "./pages/notFound";


SPComponentLoader.loadCss(
  WEB_URL + "/SiteAssets/css/fontawesome/css/all.min.css"
);
SPComponentLoader.loadCss(WEB_URL + "/SiteAssets/css/custom.min.css");

const queryClient = new QueryClient({
  defaultOptions: { queries: { retry: false, refetchOnWindowFocus: false } },
});

const MaterialConsumptionSlipWebpart: React.FC<
  IMaterialConsumptionSlipProps
> = ({ userEmail, context }) => {
  return (
    <QueryClientProvider client={queryClient}>
      <WebPartContext.Provider value={context}>
        <UserProvider userEmail={userEmail}>
          <HashRouter>
            <Routes>
              <Route
                path="/material-consumption-slip"
                element={<Navigate to="/" replace />}
              />
              <Route
                path="/"
                element={<MaterialConsumptionSlips />}
              />
              <Route
                path="/form/:mode?/:id?"
                element={<CreateEditMaterialConsumptionSlipLayout />}
              />
               <Route path="*" element={<NotFound />} />
            </Routes>
          </HashRouter>
        </UserProvider>
      </WebPartContext.Provider>
    </QueryClientProvider>
  );
};

export default MaterialConsumptionSlipWebpart;
