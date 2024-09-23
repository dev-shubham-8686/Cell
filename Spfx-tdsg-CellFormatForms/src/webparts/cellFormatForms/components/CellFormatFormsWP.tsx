import * as React from "react";
import type { ICellFormatFormsProps } from "./ICellFormatFormsProps";
import { Context, spWebUrl, VERSION } from "./GLOBAL_CONSTANT";
import { HashRouter } from "react-router-dom";
import RootComponent from "./RootComponent";
import { Provider } from "react-redux";
import store from "../store";
import { SPComponentLoader } from "@microsoft/sp-loader";
 
SPComponentLoader.loadCss(
  spWebUrl + "/SiteAssets/css/fontawesome/css/all.min.css"
);
SPComponentLoader.loadCss(spWebUrl + "/SiteAssets/css/custom.css");
export default class CellFormatFormsWp extends React.Component<
  ICellFormatFormsProps,
  {}
> {
  constructor(props: ICellFormatFormsProps) {
    super(props);
  }

  public render(): React.ReactElement<ICellFormatFormsProps> {
    return (
      <>
        <Provider store={store}>
          <Context.Provider value={this.props?.context ?? null}>
            <VERSION.Provider value={this.props?.version ?? ""}>
              <HashRouter>
                <RootComponent />
                {/* <Loader /> */}
              </HashRouter>
            </VERSION.Provider>
          </Context.Provider>
        </Provider>
      </>
    );
  }
}
