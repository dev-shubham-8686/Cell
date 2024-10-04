import * as React from "react";
import type { IEquipmentReportProps } from "./IEquipmentReportProps";
import { Context, spWebUrl, VERSION } from "../GLOBAL_CONSTANT";
import { HashRouter } from "react-router-dom";
import RootComponent from "./RootComponent";
import { SPComponentLoader } from "@microsoft/sp-loader";
import { AuthProvider } from "../context/AuthContext";

// SPComponentLoader.loadCss(
//   spWebUrl + "/SiteAssets/css/fontawesome/css/all.min.css"
// );
// SPComponentLoader.loadCss(spWebUrl + "/SiteAssets/css/custom.css");

export default class EquipmentReportWp extends React.Component<IEquipmentReportProps> {
  constructor(props: IEquipmentReportProps) {
    super(props);
  }

  public render(): React.ReactElement<IEquipmentReportProps> {
    return (
      <>
        <AuthProvider>
          <Context.Provider value={this.props?.context ?? null}>
            <VERSION.Provider value={this.props?.version ?? ""}>
              <HashRouter>
                <RootComponent />
                {/* <Loader /> */}
              </HashRouter>
            </VERSION.Provider>
          </Context.Provider>
        </AuthProvider>
      </>
    );
  }
}
