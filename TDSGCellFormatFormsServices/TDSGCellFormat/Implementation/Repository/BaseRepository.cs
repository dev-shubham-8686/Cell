using Microsoft.EntityFrameworkCore;
using TDSGCellFormat.Interface.Repository;
using System.Data.SqlClient;
using System.Collections.Generic;
using System.Data;
using System.Linq.Expressions;
using System.Reflection;

namespace TDSGCellFormat.Implementation.Repository
{ 
    public class BaseRepository<T> :IBaseRepository<T> where T : class
    {
        DbContext _context;

        public BaseRepository(DbContext context)
        {

            _context = context;
            // _context.Configuration.ProxyCreationEnabled = false;
        }

        public IDbConnection Connection => new SqlConnection(_context.Database.GetDbConnection().ConnectionString);

        protected DbSet<T> DbSet
        {
            get
            {
                return _context.Set<T>();
            }
        }

        public virtual IQueryable<T> GetByPredicate(Expression<Func<T, bool>> filter, params Expression<Func<T, object>>[] includes)
        {
            IQueryable<T> res = DbSet;

            if (includes == null || !includes.Any()) return res.Where(filter); //.FirstOrDefault(predicate);
            res = includes.Aggregate(res, (current, include) => current.Include(include));

            return res.Where(filter); //.FirstOrDefault(predicate);
        }

        public IQueryable<T> GetByPredicate(int customerId, Expression<Func<T, bool>> filter, params Expression<Func<T, object>>[] includes)
        {

            return GetByPredicate(filter, includes);
        }
        public virtual T GetByID(params object[] keyValues)
        {
            return DbSet.Find(keyValues);
        }



        public T GetByID(int customerId, params object[] keyValues)
        {
            return GetByID(keyValues);
        }


        public virtual void Create(T entity)
        {
            CreateEntity(entity);
        }

        private void CreateEntity(T entity)
        {
            //try
            //{
            DbSet.Add(entity);
            _context.SaveChanges();
            //}
            //catch
            //{

            //}

        }

        public int Createnew(T entity)
        {
            DbSet.Add(entity);
            return _context.SaveChanges();
        }





        public virtual void CreateBulk(IEnumerable<T> entity)
        {
            CreateEntityBulk(entity);
        }

        private void CreateEntityBulk(IEnumerable<T> entity)
        {
            //try
            //{
            DbSet.AddRange(entity);
            _context.SaveChanges();
            //}
            //catch
            //{

            //}

        }
        public virtual void Create(T entity, int id)
        {
            CreateEntity(entity);
        }



        public virtual void Update(T entity)
        {
            UpdateEntity(entity);
        }

        private void UpdateEntity(T entity)
        {
            DbSet.Attach(entity);
            _context.Entry(entity).State = EntityState.Modified;
            _context.SaveChanges();
        }

        public virtual void Update(T entity, int customerId)
        {
            UpdateEntity(entity);
        }

        public int UpdateNew(T entity)
        {
            DbSet.Attach(entity);
            _context.Entry(entity).State = EntityState.Modified;
            return _context.SaveChanges();
        }
        public virtual void Delete(Expression<Func<T, bool>> predicate)
        {
            var deleteList = DbSet.Where(predicate).AsQueryable();
            foreach (var obj in deleteList)
                DbSet.Remove(obj);
            _context.SaveChanges();
        }

        public virtual void Delete(int customerId, Expression<Func<T, bool>> predicate)
        {
            Delete(predicate);
        }



        private bool _disposed;

        protected virtual void Dispose(bool disposing)
        {
            if (!_disposed)
            {
                if (disposing)
                {
                    _context.Dispose();
                }
            }
            _disposed = true;
        }

        public void Dispose()
        {
            Dispose(true);
            GC.SuppressFinalize(this);
        }

        private static bool HasProperty(Type type, string name)
        {
            return type
                .GetProperties(BindingFlags.Public | BindingFlags.Instance)
                .Any(p => p.Name == name);
        }

        public T GetByID(int id)
        {
            return GetByID(new object[] { id });
        }


        public string GetPropVal(T entity, string findthis)
        {
            if (HasProperty(typeof(T), findthis))
            {
                return Convert.ToString(typeof(T).GetProperty(findthis).GetValue(entity));
            }
            return string.Empty;
        }
    }
}
