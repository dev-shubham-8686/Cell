export interface IAdjustmentReportPhoto{
    AdjustmentReportPhotoId:number;
    AdjustmentReportId:number;
    DocumentName:string;
    DocumentFilePath:string;
    IsOldPhoto:boolean;
    SequenceId:number;
    CreatedBy?:number;
    ModifiedBy?:number;
  }