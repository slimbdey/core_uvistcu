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
    public class TController<T> : Controller where T : class
    {
        protected IRepository<T> _repo;
        public TController(IRepository<T> repo) => _repo = repo;



        // GET: api/T
        [HttpGet]
        public async Task<IEnumerable<T>> GetList() => await _repo.GetList();


        // GET: api/T/5
        [HttpGet("{id}")]
        public async Task<ActionResult<T>> Get(int id)
        {
            var obj = await _repo.Get(id);

            if (obj == null)
                return NotFound();

            return obj;
        }


        // PUT: api/T
        [HttpPut]
        public async Task<IActionResult> Put(T obj)
        {
            if (ModelState.IsValid)
            {
                var newObj = await _repo.Put(obj);
                return Ok(newObj);
            }

            return BadRequest(ModelState);
        }


        // POST: api/T
        [HttpPost]
        public async Task<ActionResult> Post(T obj)
        {
            var mObj = await _repo.Post(obj);
            return Ok(mObj);
        }


        // DELETE: api/T/5
        [HttpDelete("{id}")]
        public async Task<ActionResult<T>> Delete(int id)
        {
            if (await _repo.Delete(id))
                return Ok();

            return NotFound();
        }

    }
}
