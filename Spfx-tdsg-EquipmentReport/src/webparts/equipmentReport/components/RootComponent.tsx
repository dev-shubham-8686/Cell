// import { Spin } from "antd";
// import UnAuthorized from "./pages/UnAuthorized";
// import * as React from "react";
// import { useEffect, useState } from "react";
// import { useAuth } from "../context/AuthContext";
// import EquipmentReport from "./EquipmentReport";

// const create_UUID = (): string => {
//   let dt = new Date().getTime();
//   const uuid = "xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx".replace(
//     /[xy]/g,
//     function (c) {
//       const r = (dt + Math.random() * 16) % 16 | 0;
//       dt = Math.floor(dt / 16);
//       return (c === "x" ? r : (r & 0x3) | 0x8).toString(16);
//     }
//   );
//   return uuid;
// };

// const RootComponent1: React.FC = () => {
//   const {
//     authUser,
//     setAuthUser,
//     userRole,
//     setUserRole,
//     setIsAdmin,
//     isAdmin,
//     setIsLoading,
//     isLoading,
//   } = useAuth();

//   const [authorized, setAuthorized] = useState<boolean>(false);
//   const [showLoader, setShowLoader] = useState<boolean>(true);

//   //   const authenticateUser = async (): Promise<boolean> => {
//   //     const number = create_UUID();

//   //     const token = {
//   //       EmailId: 'user@example.com', // Update with actual user email
//   //       TenentID: 'eb313930-c5da-40a3-a0f1-d2e000335fb',
//   //       APIKeyId: base64.encode(number.toString()),
//   //     };

//   //     const data = await AuthenticateUser({
//   //       parameter: base64.encode(JSON.stringify(token)),
//   //       type: 'TROUBLEREPORT',
//   //     });
//   //     return data.ResultType === 1;
//   //   };

//   const getUserRole = async (): Promise<void> => {
//     // const res = await authenticateUser();
//     if (true) {
//       //   
//       //   const UserRole = await Handler.Identity.GetUserRoleByEmail('raj.parmar@synopsandbox.onmicrosoft.com');
//       //   
//       //   if (UserRole) {
//       //     setUserRole(UserRole);
//       //     setIsAdmin(UserRole.isAdmin);
//       //     setAuthorized(true);
//       //     console.log("All providers ",userRole,authUser)
//       //   }
//     }
//   };
//   const fetchData = async () => {
//     try {
//       // 
//       setIsLoading(true);
//       await getUserRole();
//       // setAuthorized(true);
//       // setIsLoading(false);
//       // setShowLoader(false);
//     } catch (error) {
//       console.error("userrole error", error);
//     } finally {
//       // 
//       setIsLoading(false);
//       setShowLoader(false);
//     }
//   };

//   useEffect(() => {
//     void fetchData();
//   }, []);

//   return (
//     <>
//       {showLoader ? (
//         <Spin spinning={showLoader} fullscreen />
//       ) : true ? (
//         <EquipmentReport />
//       ) : (
//         <UnAuthorized />
//       )}
//     </>
//   );
// };

// export default RootComponent1;
