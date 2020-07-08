using System;
using System.Collections.Generic;
using System.Data;
using System.Linq;
using System.Threading.Tasks;
using Dapper;
using Microsoft.Data.SqlClient;
using Microsoft.Extensions.Logging;
using UVSITCU.Models.DTOs;


namespace UVSITCU.Models.Repositories
{
    public class LabourRepository : IRepository<Labour>
    {
        IDbConnection _db;
        public LabourRepository(string conString) => _db = new SqlConnection(conString);



        public async Task<bool> Delete(int id)
        {
            try
            {
                _db.Open();
                var query = "delete from Labours where Id=@id";
                int rowsDeleted = await _db.ExecuteAsync(query, new { id });

                query = "delete from UserLabours where LabourId=@id";
                await _db.ExecuteAsync(query, new { id });

                return rowsDeleted > 0;
            }
            finally { _db.Close(); }
        }

        public async Task<Labour> Get(int id)
        {
            try
            {
                _db.Open();
                string query = @"select ul.UserId Id
                                 from UserLabours ul
                                 join Labours l
                                 on ul.LabourId = l.id
                                 where LabourId=@id";
                IEnumerable<int> labourUsers = await _db.QueryAsync<int>(query, new { id });

                query = "select* from Labours where Id = @id";
                Labour labour = await _db.QuerySingleOrDefaultAsync<Labour>(query, new { id });
                labour.UserIds = labourUsers;

                return labour;
            }
            finally { _db.Close(); }
        }

        public async Task<IEnumerable<Labour>> GetList()
        {
            try
            {
                _db.Open();
                string query = "select * from UserLabours";
                IEnumerable<UserLabour> userLabours = await _db.QueryAsync<UserLabour>(query);

                query = "select * from Labours";
                IEnumerable<Labour> labours = await _db.QueryAsync<Labour>(query);

                var it = labours.GetEnumerator();
                while (it.MoveNext())
                    it.Current.UserIds = userLabours
                    .Where(ul => ul.LabourId == it.Current.Id)
                    .Select(usl => usl.UserId).ToList();

                return labours;
            }
            finally { _db.Close(); }
        }

        public async Task<bool> Post(Labour obj)
        {
            try
            {
                _db.Open();
                string query = "delete from UserLabours where LabourId=@Id";
                await _db.ExecuteAsync(query, obj);

                query = "update Labours set Date=@Date, ManagerId=@ManagerId where Id=@Id";
                await _db.ExecuteAsync(query, obj);

                query = "insert into UserLabours (UserId, LabourId) values ";
                foreach (int userId in obj.UserIds)
                    query = string.Concat(query, "(", userId.ToString(), ",", obj.Id.ToString(), "),");

                query = query.Remove(query.Length - 1);
                await _db.ExecuteAsync(query);

                return true;
            }
            finally { _db.Close(); }
        }

        public async Task<int> Put(Labour obj)
        {
            try
            {
                _db.Open();
                string query = @"insert into Labours(Date, ManagerId) 
                                output inserted.Id
                                values (@Date, @ManagerId)";
                obj.Id = await _db.QuerySingleAsync<int>(query, obj);

                query = "insert into UserLabours (UserId, LabourId) values ";
                foreach (int userId in obj.UserIds)
                    query = string.Concat(query, "(", userId.ToString(), ",", obj.Id.ToString(), "),");

                query = query.Remove(query.Length - 1);
                await _db.ExecuteAsync(query);
                return obj.Id;
            }
            finally { _db.Close(); }
        }
    }
}