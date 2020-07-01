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
        Task<int> Put(T obj);
        Task<bool> Post(T obj);
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

            else if (typeof(T) == typeof(Office))
                _table = "Offices";
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
        public async Task<bool> Post(T obj)
        {
            var query = @"update Users set 
                            FullName=@FullName,
                            OfficeId=@OfficeId,
                            TabNum=@TabNum,
                            Email=@Email,
                            PhoneNum=@PhoneNum,
                            ParticipateInLabour=@ParticipateInLabour,
                            MedExam=@MedExam,
                            LabourSecurityExam=@LabourSecurityExam,
                            IndustrialSecurityExam=@IndustrialSecurityExam,
                            GotHelmet=@GotHelmet,
                            GotSuit=@GotSuit,
                            GotBoots=@GotBoots,
                            GotCoat=@GotCoat 
                        where Id=@Id";

            if (_table == "Departments")
                query = @"update Departments set 
                            Name=@Name, 
                            ManagerId=@ManagerId 
                        where Id=@Id";

            else if (_table == "Offices")
                query = @"update Offices set 
                            Name=@Name, 
                            ChiefId=@ChiefId, 
                            DeptId=@DeptId 
                        where Id=@Id";

            int rowsAffected = await _db.ExecuteAsync(query, obj);
            return rowsAffected > 0;
        }
        public async Task<int> Put(T obj)
        {
            var query = @"insert into Users (FullName, TabNum, ParticipateInLabour) 
                            output inserted.Id
                            values (@FullName, @TabNum, @ParticipateInLabour)";
            if (_table == "Departments")
                query = @"insert into Departments (Name, ManagerId)
                            output inserted.Id
                            values (@Name, @ManagerId)";

            else if (_table == "Offices")
                query = @"insert into Offices (Name, ChiefId)
                            output inserted.Id
                            values (@Name, @ChiefId)";


            return await _db.QuerySingleAsync<int>(query, obj);
        }
    }
}