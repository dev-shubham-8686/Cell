import * as React from "react";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { HashRouter, Navigate, Route, Routes } from "react-router-dom";
import MaterialConsumptionSlips from "./pages/materialConsumptionSlip";
import { UserProvider } from "../context/userContext";
import { WebPartContext } from "../context/webpartContext";
var queryClient = new QueryClient({
    defaultOptions: { queries: { retry: false, refetchOnWindowFocus: false } },
});
var MaterialConsumptionSlipWebpart = function (_a) {
    var userEmail = _a.userEmail, context = _a.context;
    return (React.createElement(QueryClientProvider, { client: queryClient },
        React.createElement(WebPartContext.Provider, { value: context },
            React.createElement(UserProvider, { userEmail: userEmail },
                React.createElement(HashRouter, null,
                    React.createElement(Routes, null,
                        React.createElement(Route, { path: "/", element: React.createElement(Navigate, { to: "/material-consumption-slip", replace: true }) }),
                        React.createElement(Route, { path: "/material-consumption-slip/:mode?/:id?", element: React.createElement(MaterialConsumptionSlips, null) })))))));
};
export default MaterialConsumptionSlipWebpart;
//# sourceMappingURL=MaterialConsumptionSlip.js.map