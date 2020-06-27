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
    public class UserController : Controller
    {
        IRepository<User> _repo;
        public UserController(IRepository<User> repo) => _repo = repo;



        // GET: api/User
        [HttpGet]
        public async Task<IEnumerable<User>> GetList() => await _repo.GetList();


        // GET: api/User/5
        [HttpGet("{id}")]
        public async Task<ActionResult<User>> Get(int id)
        {
            var user = await _repo.Get(id);

            if (user == null)
                return NotFound();

            return user;
        }


        // PUT: api/User
        [HttpPut]
        public async Task<IActionResult> Put(User user)
        {
            if (ModelState.IsValid)
            {
                await _repo.Put(user);
                return Ok();
            }

            return BadRequest(ModelState);
        }


        // POST: api/User
        [HttpPost]
        public async Task<ActionResult> Post(User user)
        {
            await _repo.Post(user);
            return Ok();
        }


        // DELETE: api/User/5
        [HttpDelete("{id}")]
        public async Task<ActionResult<User>> Delete(int id)
        {
            if (await _repo.Delete(id))
                return Ok();

            return NotFound();
        }

    }
}
