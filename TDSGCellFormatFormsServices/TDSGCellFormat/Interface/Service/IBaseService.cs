namespace TDSGCellFormat.Interface.Service
{
    public interface IBaseService<T> where T : class
    {
        void Create(T entity);
        void Create(T entity, int universityId);


        void Update(T entity);
        void Update(T entity, int universityId);


        T GetByID(int id);
        T GetByID(int id, int universityId);
    }
}
