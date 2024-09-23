import * as React from "react";
import type { ICellFormatFormsProps } from "./ICellFormatFormsProps";
import { Navigate, Route, Routes, useNavigate } from "react-router-dom";
import NotFound from "./Pages/NotFound";
import { Context } from "./GLOBAL_CONSTANT";
import { IAppState } from "../store/reducers";
import { connect } from "react-redux";
import TroubleReport from "./Pages/TroubleReport";
import TroubleForm from "./TroubleReport/Form";
import ReportFormPage from "./Pages/ReportFormPage";
import TroubleHistory from "./TroubleReport/TroubleHistory";
import TroubleWorkflow from "./TroubleReport/TroubleWorkflow";
//import TroubleHistory from "./TroubleReport/TroubleHistory";
// import TroubleType from "./Master/TroubleType";
// import Category from "./Master/Category"
// import Material from "./Master/Material"
// import UOM from "./Master/Uom"
// import MasterManagement from "./Master/Master";
class CellFormatForms extends React.Component<ICellFormatFormsProps> {
  static contextType = Context;
  context: React.ContextType<typeof Context>;

  public render(): React.ReactElement<ICellFormatFormsProps> {
    return (
      <Routes>
        <Route path="/" element={<TroubleReport />} />
        <Route
          path="/form/:mode/:id?"
          element={
            <ReportFormPage
              context={this.context}
              HistoryComponent={TroubleHistory}
              WorkflowComponent={TroubleWorkflow}
            >
              <TroubleForm context={this.context} />
            </ReportFormPage>
          }
        />

        <Route path="*" element={<NotFound />} />
      </Routes>
    );
  }
}

const mapStateToProps = (state: IAppState) => {
  return {
    isAdmin: state.Common.isAdmin,
    userRole: state.Common.userRole,
    isLoading: state.Common.isLoading,
  };
};

const mapDispatchToProps = (dispatch: any) => {
  return {
    //   setUserRole: (value: IUserRole) =>
    //     dispatch(actions.Common.setUserRole(value)),
  };
};

export const withRouter = (Component: any) => {
  const Wrapper = (props: any) => {
    const history = useNavigate();
    return <Component history={history} {...props} />;
  };
  return Wrapper;
};

export default withRouter(
  connect(mapStateToProps, mapDispatchToProps)(CellFormatForms)
);
