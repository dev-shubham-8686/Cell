import * as React from "react";
import type { IEquipmentReportProps } from "./IEquipmentReportProps";
import { HashRouter } from "react-router-dom";


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
      <>HELLO</>
      // <>
      //   <AuthProvider>
      //     <Context.Provider value={this.props?.context ?? null}>
      //       <VERSION.Provider value={this.props?.version ?? ""}>
      //         <HashRouter>
      //           <RootComponent />
      //           {/* <Loader /> */}
      //         </HashRouter>
      //       </VERSION.Provider>
      //     </Context.Provider>
      //   </AuthProvider>
      // </>
    );
  }
}
