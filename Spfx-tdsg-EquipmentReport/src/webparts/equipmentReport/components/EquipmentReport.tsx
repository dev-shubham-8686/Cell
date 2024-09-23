import * as React from "react";
import styles from "./EquipmentReport.module.scss";
import type { IEquipmentReportProps } from "./IEquipmentReportProps";
import { Route, Routes } from "react-router-dom";
import ReportFormPage from "../pages/ReportFormPage";
import Dashboard from "../pages/Dashboard";

export default class EquipmentReport extends React.Component<IEquipmentReportProps> {
  public render(): React.ReactElement<IEquipmentReportProps> {
    const {
      description,
      isDarkTheme,
      environmentMessage,
      hasTeamsContext,
      userDisplayName,
    } = this.props;

    return (
      <Routes>
        <Route path="/equipment-improvement-report" element={<Dashboard />} />
        <Route
          path="/equipment-improvement-report/form"
          element={
            <ReportFormPage>
              <div>form</div>
            </ReportFormPage>
          }
        />
      </Routes>
    );
  }
}
