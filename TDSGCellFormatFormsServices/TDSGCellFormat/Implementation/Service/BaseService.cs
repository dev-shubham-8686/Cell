using TDSGCellFormat.Interface.Repository;
using TDSGCellFormat.Interface.Service;

namespace TDSGCellFormat.Implementation.Service
{
    public class BaseService<T> :IBaseService<T> where T : class
    {
        public readonly IBaseRepository<T> _baseRepository;

        public BaseService(IBaseRepository<T> baseRepository)
        {
            _baseRepository = baseRepository;
        }

        public void Create(T entity)
        {
            _baseRepository.Create(entity);
        }

        public void Create(T entity, int universityId)
        {
            _baseRepository.Create(entity, universityId);
        }

        public void Update(T entity)
        {
            _baseRepository.Update(entity);
        }

        public void Update(T entity, int universityId)
        {
            _baseRepository.Update(entity, universityId);
        }

        public virtual T GetByID(int id)
        {
            return _baseRepository.GetByID(id);
        }

        public T GetByID(int id, int universityId)
        {
            return _baseRepository.GetByID(id, universityId);
        }
    }
}
