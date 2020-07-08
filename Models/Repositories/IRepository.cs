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



    public abstract class TRepository<T> : IRepository<T> where T : class
    {
        protected IDbConnection _db;
        protected string _table;
        public TRepository(string conString, string tableName)
        {
            _db = new SqlConnection(conString);
            _table = tableName;
        }


        public async Task<bool> Delete(int id)
        {
            var query = $"delete from {_table} where Id=@id";
            int rowsDeleted = await _db.ExecuteAsync(query, new { id });

            if (rowsDeleted > 0)
                return true;

            return false;
        }

        public async Task<T> Get(int id) => await _db.QueryFirstOrDefaultAsync<T>($"select * from {_table} where Id=@id", new { id });

        public async Task<IEnumerable<T>> GetList() => await _db.QueryAsync<T>($"select * from {_table}");

        public abstract Task<bool> Post(T obj);

        public abstract Task<int> Put(T obj);
    }



    public class UserRepository : TRepository<User>
    {
        public UserRepository(string conString) : base(conString, "Users") { }

        public override async Task<bool> Post(User obj)
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

            int rowsAffected = await _db.ExecuteAsync(query, obj);
            return rowsAffected > 0;
        }
        public override async Task<int> Put(User obj)
        {
            var query = @"insert into Users (FullName, TabNum, ParticipateInLabour) 
                            output inserted.Id
                            values (@FullName, @TabNum, @ParticipateInLabour)";

            return await _db.QuerySingleAsync<int>(query, obj);
        }
    }



    public class DepartmentRepository : TRepository<Department>
    {
        public DepartmentRepository(string conString) : base(conString, "Departments") { }

        public override async Task<bool> Post(Department obj)
        {
            string query = @"update Departments set 
                                Name=@Name, 
                                ManagerId=@ManagerId 
                            where Id=@Id";

            int rowsAffected = await _db.ExecuteAsync(query, obj);
            return rowsAffected > 0;
        }
        public override async Task<int> Put(Department obj)
        {
            var query = @"insert into Departments (Name, ManagerId)
                            output inserted.Id
                            values (@Name, @ManagerId)";

            return await _db.QuerySingleAsync<int>(query, obj);
        }
    }



    public class OfficeRepository : TRepository<Office>
    {
        public OfficeRepository(string conString) : base(conString, "Offices") { }

        public override async Task<bool> Post(Office obj)
        {
            string query = @"update Offices set 
                                Name=@Name, 
                                ChiefId=@ChiefId, 
                                DeptId=@DeptId 
                            where Id=@Id";

            int rowsAffected = await _db.ExecuteAsync(query, obj);
            return rowsAffected > 0;
        }
        public override async Task<int> Put(Office obj)
        {
            var query = @"insert into Offices (Name, ChiefId)
                            output inserted.Id
                            values (@Name, @ChiefId)";

            return await _db.QuerySingleAsync<int>(query, obj);
        }
    }



    public class VacationRepository : TRepository<Vacation>
    {
        public VacationRepository(string conString) : base(conString, "Vacations") { }


        public override async Task<bool> Post(Vacation obj)
        {
            string query = @"update Vacations set 
                                UserId=@UserId, 
                                BeginDate=@BeginDate,
                                EndDate=@EndDate,
                                Score=@Score 
                            where Id=@Id";

            int rowsAffected = await _db.ExecuteAsync(query, obj);
            return rowsAffected > 0;
        }


        public override async Task<int> Put(Vacation obj)
        {
            var query = @"insert into Vacations (UserId, BeginDate, EndDate)
                            output inserted.Id
                            values (@UserId, @BeginDate, @EndDate)";

            return await _db.QuerySingleAsync<int>(query, obj);
        }
    }
}