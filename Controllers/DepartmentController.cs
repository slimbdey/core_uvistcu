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
    public class DepartmentController : Controller
    {
        IRepository<Department> _repo;
        public DepartmentController(IRepository<Department> repo) => _repo = repo;



        // GET: api/Department
        [HttpGet]
        public async Task<IEnumerable<Department>> GetList() => await _repo.GetList();


        // GET: api/Department/5
        [HttpGet("{id}")]
        public async Task<ActionResult<Department>> Get(int id)
        {
            var dept = await _repo.Get(id);

            if (dept == null)
                return NotFound();

            return dept;
        }


        // PUT: api/Department
        [HttpPut]
        public async Task<IActionResult> Put(Department dept)
        {
            if (ModelState.IsValid)
            {
                var newDept = await _repo.Put(dept);
                return Ok(newDept);
            }

            return BadRequest(ModelState);
        }


        // POST: api/Department
        [HttpPost]
        public async Task<ActionResult> Post(Department dept)
        {
            var mDept = await _repo.Post(dept);
            return Ok(mDept);
        }


        // DELETE: api/Department/5
        [HttpDelete("{id}")]
        public async Task<ActionResult<Department>> Delete(int id)
        {
            if (await _repo.Delete(id))
                return Ok();

            return NotFound();
        }

    }
}
