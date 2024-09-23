import * as React from "react";
import { Context, TENANT_ID } from "./GLOBAL_CONSTANT";
import CellFormatForms from "./CellFormatForms";
import UnAuthorized from "../components/Pages/UnAuthorized";
import { connect } from "react-redux";
import actions from "../store/actions";
import { IAuthUser, IUserRole } from "../store/reducers/common";
import { IAppState } from "../store/reducers";
import Handler from "./utils/Handler";
import {
  AuthenticateUser,
  AuthResponse,
  IAuthenticateUserParam,
} from "./utils/Handler/Identity";
import base64 from "react-native-base64";
import { Spin } from "antd";

const create_UUID = (): string => {
  let dt = new Date().getTime();
  const uuid = "xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx".replace(
    /[xy]/g,
    function (c) {
      const r = (dt + Math.random() * 16) % 16 | 0;
      dt = Math.floor(dt / 16);
      return (c === "x" ? r : (r & 0x3) | 0x8).toString(16);
    }
  );
  return uuid;
};

interface RootCompoProps {
  authUser?: IAuthUser;
  setIsAdmin?: (value: boolean) => void;
  setUserRole?: (value: IUserRole) => void;
  setAuthUser?: (value: IAuthUser) => void;
  setIsLoading?: (value: boolean) => void;
}
interface RouteComponentStates {
  admin: boolean;
  authorized: boolean;
  showLoader: boolean;
}

class RootComponent extends React.Component<
  RootCompoProps,
  RouteComponentStates
> {
  static contextType = Context;
  context: React.ContextType<typeof Context>;

  constructor(props: RootCompoProps) {
    super(props);
    this.state = {
      admin: false,
      authorized: false,
      showLoader: true,
    };
  }

  private authenticateUser = async (): Promise<boolean> => {
    const number = create_UUID();

    const token = {
      // EmailId: "Vishal.Trivedi001@tdsgj.co.in",   //TODO: update before deployment
      EmailId: this.context.pageContext.user.email,
      TenentID: TENANT_ID,
      APIKeyId: base64.encode(number.toString()),
    };

    const data = await AuthenticateUser({
      parameter: base64.encode(JSON.stringify(token)),
      type: "TROUBLEREPORT",
    });
    if (data.ResultType === 1) return true;
    return false;
  };

  private getUserRole = async (): Promise<void> => {
    const res = await this.authenticateUser();
    if (res) {
      const userRole = await Handler.Identity.GetUserRoleByEmail(
        this.context?.pageContext.user.email ?? "" // TODO: update before deployment
      );
      console.log("USERROLE Res", userRole);
      if (userRole) {
        this.props.setUserRole(userRole);
        this.props.setIsAdmin(userRole?.isAdmin);
        //  this.props.setIsLoading(false);
        this.setState({
          authorized: true,
          showLoader: false,
        });
      }
    }
  };

  public componentDidMount(): void {
    try {
      this.props.setIsLoading(true);
      void this.getUserRole().then(() => {
        void this.props.setIsLoading(false);
        this.setState({
          showLoader: false,
        });
      });
    } catch (error) {
      console.error("userrole error ", error);
      this.props.setIsLoading(false);
      this.setState({
        showLoader: false,
      });
    }
  }

  public render(): React.ReactElement<RootCompoProps> {
    return (
      <>
        {this.state.showLoader ? (
          <Spin spinning={this.state.showLoader} fullscreen />
        ) : this.state.authorized ? (
          <CellFormatForms />
        ) : (
          <UnAuthorized />
        )}
      </>
    );
  }
}

const mapStateToProps = (state: IAppState) => {
  return {
    authUser: state.Common.authUser,
  };
};

const mapDispatchToProps = (dispatch: any) => {
  return {
    setIsAdmin: (value: boolean) => dispatch(actions.Common.setIsAdmin(value)),
    setUserRole: (value: IUserRole) =>
      dispatch(actions.Common.setUserRole(value)),
    setAuthUser: (value: IAuthUser) =>
      dispatch(actions.Common.setAuthUser(value)),
    setIsLoading: (value: boolean) =>
      dispatch(actions.Common.setIsLoading(value)),
  };
};

export default connect(mapStateToProps, mapDispatchToProps)(RootComponent);
