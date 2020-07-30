using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using UVSITCU.Models.DTOs;
using UVSITCU.Models.Repositories;

namespace UVSITCU.Controllers
{
  [ApiController]
  [Route("api/[controller]")]
  public class UserController : TController<User>
  {
    private readonly IUserRepository _auth;
    public UserController(IUserRepository repo) : base(repo) { _auth = repo; }


    ///// GET: api/User/Authenticate?Fullname=...&Password=...
    [HttpGet("Authenticate")]
    public async Task<IActionResult> Authenticate(string FullName, string Password)
    {
      var users = await _repo.GetList();

      try
      {
        var user = users.First(u => u.FullName == FullName && u.Password == Password);
        return Ok(user);
      }
      catch (Exception ex) { return BadRequest(new { errors = new { ex.Message } }); }
    }


    ///// GET: api/User/GetUserRole/5
    [HttpGet("GetUserRole/{id}")]
    public async Task<IActionResult> GetUserRole(int id)
    {
      try
      {
        var role = await _auth.GetUserRole(id);
        return Ok(role);
      }
      catch (Exception ex) { return BadRequest(new { errors = new { ex.Message } }); }
    }
  }
}
