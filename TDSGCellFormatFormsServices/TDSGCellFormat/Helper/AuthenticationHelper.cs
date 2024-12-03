using DocumentFormat.OpenXml.InkML;
using Microsoft.AspNetCore.Http;
using Microsoft.EntityFrameworkCore;
using Microsoft.VisualBasic;
using Newtonsoft.Json;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using TDSGCellFormat.Common;
using TDSGCellFormat.Helper;
using TDSGCellFormat.Models;
using TDSGCellFormat.Models.View;
using static TDSGCellFormat.Common.Enums;

namespace TDSGCellFormat.Helper
{
    public class AuthenticationHelper
    {
        private readonly TdsgCellFormatDivisionContext _db;
        private readonly AepplNewCloneStageContext _masterDb;
        private readonly IHttpContextAccessor _httpContextAccessor;

        public AuthenticationHelper(TdsgCellFormatDivisionContext db, AepplNewCloneStageContext masterDb, IHttpContextAccessor httpContextAccessor)
        {
            _db = db;
            _masterDb = masterDb;
            _httpContextAccessor = httpContextAccessor;
        }

        public Tuple<string, bool> IsValidAuthentication1()
        {
            AjaxResult result = new AjaxResult();
            try
            {
                var headers = _httpContextAccessor.HttpContext.Request.Headers;
                string authenticationCode = headers["Authorization"].ToString();

                var existRecord = _masterDb.AuthSessions
                    .Where(x => x.APIKeyId.Trim().ToLower() == authenticationCode.Trim().ToLower() && x.IsExpired == false)
                    .FirstOrDefault();

                if (existRecord != null)
                {
                    if (!_masterDb.EmployeeMasters.Any(x => x.EmployeeID == existRecord.UserId && x.IsActive))
                    {
                        result.ResultType = (int)MessageType.NotAuthorize;
                        result.StatusCode = Status.Cancel;
                        result.Message = Enums.TroubleAuthorization;
                        return new Tuple<string, bool>(JsonConvert.SerializeObject(result), false);
                    }

                    existRecord.LastActivity = DateTime.Now;
                    _masterDb.Entry(existRecord).State = EntityState.Modified;
                    _masterDb.SaveChanges();

                    result.StatusCode = Status.Success; 
                    result.Message = "Success";
                    return new Tuple<string, bool>(JsonConvert.SerializeObject(result), true);
                }

                result.StatusCode = Status.Cancel;
                result.ResultType = (int)MessageType.AccessInValid;
                result.Message = Enums.TroubleSessionExpired;
                return new Tuple<string, bool>(JsonConvert.SerializeObject(result), false);
            }
            catch (Exception e)
            {
                result.StatusCode = Status.Cancel;
                result.ResultType = (int)MessageType.Error;
                result.Message = Enums.TroubleSessionExpired;
                return new Tuple<string, bool>(JsonConvert.SerializeObject(result), false);
            }
        }

        public bool IsValidAuthenticationOld(out AjaxResult result)
        {
            result = new AjaxResult();
            try
            {
                var headers = _httpContextAccessor.HttpContext.Request.Headers;
                string authenticationCode = headers["Authorization"].ToString();

                var existRecord = _masterDb.AuthSessions
                    .Where(x => x.APIKeyId.Trim().ToLower() == authenticationCode.Trim().ToLower() && x.IsExpired == false)
                    .FirstOrDefault();

                if (existRecord != null)
                {
                    if (!_masterDb.EmployeeMasters.Any(x => x.EmployeeID == existRecord.UserId && x.IsActive))
                    {
                        result.ResultType = (int)MessageType.NotAuthorize;
                        result.StatusCode = Status.Cancel;
                        result.Message = Enums.TroubleAuthorization;
                        return false;
                    }

                    existRecord.LastActivity = DateTime.Now;
                    _masterDb.Entry(existRecord).State = EntityState.Modified;
                    _masterDb.SaveChanges();

                    result.StatusCode = Status.Success;
                    result.Message = "Success";
                    return true;
                }

                result.StatusCode = Status.Cancel;
                result.ResultType = (int)MessageType.AccessInValid;
                result.Message =Enums.TroubleSessionExpired;
                return false;
            }
            catch (Exception e)
            {
                result.StatusCode = Status.Cancel;
                result.ResultType = (int)MessageType.Error;
                result.Message =Enums.TroubleSessionExpired;
                return false;
            }
        }
        public bool IsValidAuthentication(out AjaxResult result)
        {
            result = new AjaxResult();
            try
            {
                var headers = _httpContextAccessor.HttpContext.Request.Headers;
                string authenticationCode = headers["Authorization"].ToString();

                var existRecord = _masterDb.AuthSessions
                    .Where(x => x.APIKeyId.Trim().ToLower() == authenticationCode.Trim().ToLower() && x.IsExpired == false)
                    .FirstOrDefault();

                if (existRecord != null)
                {
                    if (_masterDb.EmployeeMasters.Where(x => x.EmployeeID == existRecord.UserId && x.IsActive).Count() < 1)
                    {
                        result.ResultType = (int)MessageType.NotAuthorize;
                        result.StatusCode = Status.SessionTimeOut;
                        result.Message = Enums.TroubleAuthorization;
                        return false;
                    }

                    existRecord.LastActivity = DateTime.Now;
                    _masterDb.Entry(existRecord).State = EntityState.Modified;
                    _masterDb.SaveChanges();

                    result.StatusCode = Status.Success;
                    result.Message = Enums.TroubleSuccess;
                    return true;
                }

                result.StatusCode = Status.SessionTimeOut;
                result.ResultType = (int)MessageType.AccessInValid;
                result.Message = Enums.TroubleSessionExpired;
                return false;
            }
            catch (Exception e)
            {
                result.StatusCode = Status.Error;
                result.ResultType = (int)MessageType.Error;
                result.Message = Enums.TroubleSessionExpired;
                return false;
            }
        }

        public bool IsValidAuthenticationFalse(out AjaxResult result)
        {
            result = new AjaxResult();
            try
            {
                var headers = _httpContextAccessor.HttpContext.Request.Headers;
                string authenticationCode = headers["Authorization"].ToString();

                var existRecord = _masterDb.AuthSessions
                    .Where(x => x.APIKeyId.Trim().ToLower() == authenticationCode.Trim().ToLower() && x.IsExpired == false)
                    .FirstOrDefault();

                if (existRecord != null)
                {
                    if (!_masterDb.EmployeeMasters.Any(x => x.EmployeeID == existRecord.UserId && x.IsActive))
                    {
                        result.ResultType = (int)MessageType.NotAuthorize;
                        result.StatusCode = Status.Cancel;
                        result.Message = Enums.TroubleAuthorization;
                        return true;
                    }

                    existRecord.LastActivity = DateTime.Now;
                    _masterDb.Entry(existRecord).State = EntityState.Modified;
                    _masterDb.SaveChanges();

                    result.StatusCode = Status.Success;
                    result.Message = "Success";
                    return true;
                }

                result.StatusCode = Status.Cancel;
                result.ResultType = (int)MessageType.AccessInValid;
                result.Message =Enums.TroubleSessionExpired;
                return true;
            }
            catch (Exception e)
            {
                result.StatusCode = Status.Cancel;
                result.ResultType = (int)MessageType.Error;
                result.Message =Enums.TroubleSessionExpired;
                return false;
            }
        }

        public string CreateAuthSession(string parameter, string type)
        {
            AjaxResult result = new AjaxResult();
            string base64Decoded;
            byte[] data = Convert.FromBase64String(parameter);
            base64Decoded = Encoding.ASCII.GetString(data);

            var model = JsonConvert.DeserializeObject<AuthSessionModel>(base64Decoded);
            try
            {
                if (_masterDb.EmployeeMasters.Where(x => x.Email == model.EmailId && x.IsActive).Count() < 1)
                {
                    result.ResultType = (int)MessageType.NotAuthorize;
                    result.StatusCode = Status.SessionTimeOut;
                    result.Message = Enums.TroubleAuthorization;
                    return JsonConvert.SerializeObject(result);
                }

                var empId = _masterDb.EmployeeMasters.Where(x => x.Email == model.EmailId).FirstOrDefault()?.EmployeeID;
                var existRecord = _masterDb.AuthSessions
                    .Where(x => x.APIKeyId.Trim().ToLower() == model.APIKeyId.Trim().ToLower() && x.IsExpired.Value == false && x.UserId == empId)
                    .FirstOrDefault();

                if (existRecord != null)
                {
                    if (type == ProjectType.TroubleReport.ToString().ToUpper())
                    {
                        result.ResultType = (int)MessageType.Success;
                        result.StatusCode = Status.Success;
                        result.Message = model.APIKeyId;
                        return JsonConvert.SerializeObject(result);
                    }
                    if (type == ProjectType.MaterialConsumption.ToString().ToUpper())
                    {
                        result.ResultType = (int)MessageType.Success;
                        result.StatusCode = Status.Success;
                        result.Message = model.APIKeyId;
                        return JsonConvert.SerializeObject(result);
                    }
                    if (type == ProjectType.Equipment.ToString().ToUpper())
                    {
                        result.ResultType = (int)MessageType.Success;
                        result.StatusCode = Status.Success;
                        result.Message = model.APIKeyId;
                        return JsonConvert.SerializeObject(result);
                    }
                    if (type == ProjectType.AdjustMentReport.ToString().ToUpper())
                    {
                        result.ResultType = (int)MessageType.Success;
                        result.StatusCode = Status.Success;
                        result.Message = model.APIKeyId;
                        return JsonConvert.SerializeObject(result);
                    }
                    return model.APIKeyId;
                }

                var getPrevLoginDetail = _masterDb.AuthSessions.Where(x => x.UserId == empId).ToList();
                if (getPrevLoginDetail.Count > 0)
                {
                    _masterDb.AuthSessions.RemoveRange(getPrevLoginDetail);
                }

                var authmodel = new AuthSession
                {
                    APIKeyId = model.APIKeyId,
                    AuthSessionId = model.AuthSessionId,
                    TenentID = model.TenentID,
                    UserId = empId,
                    StartDateTime = DateTime.Now,
                    EndDateTime = DateTime.Now.AddMinutes(30),
                    LastActivity = DateTime.Now,
                    IsExpired = false
                };

                _masterDb.Entry(authmodel).State = EntityState.Added;
                _masterDb.SaveChanges();
            }
            catch (Exception ex)
            {
                
                var commonHelper = new CommonHelper(_db);
                commonHelper.LogException(ex, "createAuth session");
                // return false;
                result.StatusCode = Status.Error;
                result.Message = ex.Message;
                return JsonConvert.SerializeObject(result);
            }

            if (type == ProjectType.TroubleReport.ToString().ToUpper())
            {
                result.ResultType = (int)MessageType.Success;
                result.StatusCode = Status.Success;
                result.Message = model.APIKeyId;
                return JsonConvert.SerializeObject(result);
            }
            if (type == ProjectType.MaterialConsumption.ToString().ToUpper())
            {
                result.ResultType = (int)MessageType.Success;
                result.StatusCode = Status.Success;
                result.Message = model.APIKeyId;
                return JsonConvert.SerializeObject(result);
            }

            result.ResultType = (int)MessageType.Success;
            result.StatusCode = Status.Success;
            result.Message = model.APIKeyId;
            return JsonConvert.SerializeObject(result);
        }
    }
}
