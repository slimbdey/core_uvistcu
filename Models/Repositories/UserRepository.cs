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
  public interface IUserRepository : IRepository<User>
  {
    Task<IEnumerable<UserRole>> GetRoles();
    Task<UserRole> GetUserRole(int UserId);
    Task<bool> SetUserRole(int UserId, int RoleId);
  }




  public class UserRepository : IUserRepository
  {
    protected IDbConnection _db;
    public UserRepository(string conString) => _db = new SqlConnection(conString);


    public async Task<bool> Delete(int id)
    {
      var query = $"delete from Users where Id=@id";
      int rowsDeleted = await _db.ExecuteAsync(query, new { id });

      if (rowsDeleted > 0)
        return true;

      return false;
    }


    public async Task<User> Get(int id) => await _db.QueryFirstOrDefaultAsync<User>($"select * from Users where Id=@id", new { id });


    public async Task<IEnumerable<User>> GetList() => await _db.QueryAsync<User>($"select * from Users");


    public async Task<IEnumerable<UserRole>> GetRoles() => await _db.QueryAsync<UserRole>($"select * from UserRoles");


    public async Task<UserRole> GetUserRole(int UserId) => await _db.QueryFirstOrDefaultAsync<UserRole>($"select * from UserRoles where Id=(select RoleId from Users where Id=@UserId)", new { UserId });


    public async Task<bool> Post(User obj)
    {
      var query = @"update Users set 
                            FullName=@FullName,
                            DeptId=@DeptId,
                            OfficeId=@OfficeId,
                            RoleId=@RoleId,
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
                            GotCoat=@GotCoat,
                            VacationRating=@VacationRating
                        where Id=@Id";

      int rowsAffected = await _db.ExecuteAsync(query, obj);
      return rowsAffected > 0;
    }


    public async Task<int> Put(User obj)
    {
      var query = @"insert into Users (FullName, TabNum, Password, ParticipateInLabour) 
                            output inserted.Id
                            values (@FullName, @TabNum, @Password, @ParticipateInLabour)";

      return await _db.QuerySingleAsync<int>(query, obj);
    }


    public async Task<bool> SetUserRole(int UserId, int RoleId)
    {
      var query = @"update Users set RoleId=@RoleId where Id=@UserId";
      int rowsAffected = await _db.ExecuteAsync(query, new { RoleId = RoleId, UserId = UserId });
      return rowsAffected > 0;
    }
  }
}