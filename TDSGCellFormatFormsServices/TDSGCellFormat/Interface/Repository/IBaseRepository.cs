using System.Linq.Expressions;

namespace TDSGCellFormat.Interface.Repository
{
    public interface IBaseRepository<T> : IDisposable where T : class
    {
        //Create
        void Create(T entity);
        void Create(T entity, int id);
        void CreateBulk(IEnumerable<T> entity);
        int Createnew(T entity);

        //Read

        IQueryable<T> GetByPredicate(Expression<Func<T, bool>> filter, params Expression<Func<T, object>>[] includes);
        IQueryable<T> GetByPredicate(int id, Expression<Func<T, bool>> filter, params Expression<Func<T, object>>[] includes);

        T GetByID(params object[] keyValues);
        T GetByID(int id, params object[] keyValues);
        T GetByID(int id);

        //Update
        void Update(T entity);

        void Update(T entity, int id);
        int UpdateNew(T entity);
        //Delete
        void Delete(Expression<Func<T, bool>> predicate);

        void Delete(int id, Expression<Func<T, bool>> predicate);



    }
}
