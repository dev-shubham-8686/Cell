// export interface IPagination {
//   pageNumber: number;
//   pageSize: number;
//   order: string;
//   orderby: string;
//   search: string;
// }

// export interface IAPIResponse {
//   NewId: number;
//   RecordNumber: string;
//   ResultType: number;
//   Message: string;
//   refNumber: string;
//   data: string;
// }

export enum MessageType {
  Create = 1,
  Approved = 2,
  SessionTimeOut = 3,
  Close = 4,
  Received = 5,
  Error = 6,
  Success = 7,
  PartialSuccess = 8
}

export interface IAPIResponse {
  [key: string] : any;
}

