using Microsoft.EntityFrameworkCore;
using System.Data.Common;
using System.Data;
using System.Reflection;

namespace TDSGCellFormat.Extensions
{
    public static class SprocRepositoryExtensions
    {
        public static DbCommand LoadStoredProcedure(this DbContext context, string? storedProcName)
        {
            DbCommand cmd = context.Database.GetDbConnection().CreateCommand();
            cmd.CommandText = storedProcName;
            cmd.CommandType = CommandType.StoredProcedure;
            return cmd;
        }

        public static DbCommand WithSqlParams(this DbCommand cmd, params (string, object)[] nameValueParamPairs)
        {
            foreach (var pair in nameValueParamPairs)
            {
                var param = cmd.CreateParameter();
                param.ParameterName = pair.Item1;
                param.Value = pair.Item2 ?? DBNull.Value;
                cmd.Parameters.Add(param);
            }

            return cmd;
        }

        public static DbCommand WithSqlOutParams(this DbCommand cmd, params (string, object, bool)[] nameValueParamPairs)
        {
            foreach (var pair in nameValueParamPairs)
            {
                var param = cmd.CreateParameter();
                param.ParameterName = pair.Item1;
                param.Value = pair.Item2 ?? DBNull.Value;

                if (pair.Item3)
                    param.Direction = ParameterDirection.Output;

                cmd.Parameters.Add(param);
            }

            return cmd;
        }

        public static IList<T>? ExecuteStoredProcedure<T>(this DbCommand command) where T : class
        {
            using (command)
            {
                if (command?.Connection?.State == ConnectionState.Closed)
                    command?.Connection?.Open();
                try
                {
                    using var reader = command?.ExecuteReader();
                    return reader?.MapToList<T>();
                }
                finally
                {
                    command?.Connection?.Close();
                }
            }
        }

        public static async Task<IList<T>> ExecuteStoredProcedureAsync<T>(this DbCommand command) where T : class
        {
            using (command)
            {
                if (command?.Connection?.State == ConnectionState.Closed)
                {
                    await command.Connection.OpenAsync();
                }

                try
                {
                    using DbDataReader? reader = await command?.ExecuteReaderAsync();
                    return reader.MapToList<T>();
                }
                finally
                {
                    command?.Connection?.Close();
                }
            }
        }

        public static async Task ExecuteNonQueryStoredProcedureAsync(this DbCommand command)
        {
            if (command == null)
                throw new ArgumentNullException(nameof(command));

            using (command)
            {
                if (command.Connection?.State == ConnectionState.Closed)
                {
                    await command.Connection.OpenAsync();
                }

                try
                {
                    await command.ExecuteNonQueryAsync();
                }
                finally
                {
                    command.Connection?.Close();
                }
            }
        }

        private static IList<T> MapToList<T>(this DbDataReader dr)
        {
            var objList = new List<T>();
            var props = typeof(T).GetRuntimeProperties();

            Dictionary<string, DbColumn> colMapping = dr.GetColumnSchema()
                .Where(x => props.Any(y => y?.Name?.ToLower() == x?.ColumnName?.ToLower()))
                .ToDictionary(key => key.ColumnName.ToLower());

            if (dr.HasRows)
            {
                while (dr.Read())
                {
                    T obj = Activator.CreateInstance<T>();
                    foreach (var prop in props)
                    {
                        bool exists = Enumerable.Range(0, dr.FieldCount).Any(i => string.Equals(dr.GetName(i), prop.Name.ToLower(), StringComparison.OrdinalIgnoreCase));
                        object? val = exists ? dr.GetValue(colMapping[prop?.Name.ToLower()].ColumnOrdinal.Value) : null;
                        prop.SetValue(obj, val == DBNull.Value ? null : val);
                    }
                    objList.Add(obj);
                }
            }
            return objList;
        }
    }
}
