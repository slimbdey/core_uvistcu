using System.Collections.Generic;
using System.Data;
using System.Threading.Tasks;
using Dapper;
using Microsoft.Data.SqlClient;
using UVSITCU.Models.DTOs;


namespace UVSITCU.Models.Repositories
{
    public interface IRepository<T> where T : class
    {
        Task<T> Put(T obj);
        Task<T> Post(T obj);
        Task<T> Get(int id);
        Task<IEnumerable<T>> GetList();
        Task<bool> Delete(int id);
    }



    public class TRepository<T> : IRepository<T> where T : class
    {
        IDbConnection _db;
        string _table;
        public TRepository(string conString)
        {
            _db = new SqlConnection(conString);

            _table = "Users";
            if (typeof(T) == typeof(Department))
                _table = "Departments";
        }


        public async Task<bool> Delete(int id)
        {
            var one = await _db.QueryFirstOrDefaultAsync<T>($"select * from {_table} where Id=@id", new { id });

            if (one != null)
            {
                var query = $"delete from {_table} where Id=@id";
                await _db.ExecuteAsync(query, new { id });
                return true;
            }

            return false;
        }
        public async Task<T> Get(int id) => await _db.QueryFirstOrDefaultAsync<T>($"select * from {_table} where Id=@id", new { id });
        public async Task<IEnumerable<T>> GetList() => await _db.QueryAsync<T>($"select * from {_table}");
        public async Task<T> Post(T obj)
        {
            var query = "update Users set FullName=@FullName, TabNum=@TabNum where Id=@Id";
            if (_table == "Departments")
                query = "update Departments set Name=@Name, ManagerId=@ManagerId where Id=@Id";

            await _db.ExecuteAsync(query, obj);
            return obj;
        }
        public async Task<T> Put(T obj)
        {
            var query = "insert into Users (FullName, TabNum) values (@FullName, @TabNum)";
            if (_table == "Departments")
                query = "insert into Departments (Name, ManagerId) values (@Name, @ManagerId)";

            await _db.ExecuteAsync(query, obj);
            return obj;
        }
    }
}