using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using dotnetapp.Data;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
namespace dotnetapp.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class UserLogController : ControllerBase
    {
        private readonly ApplicationDbContext _context;
        public UserLogController(ApplicationDbContext context)
        {
            _context = context;
        }
        [HttpGet]
        public async Task<IActionResult> GetAllUserLogs()
        {
            var list=await _context.UserLogs.Include(e => e.User).Select(e => new { e.UserId,e.User.Username,e.User.Email,Role=e.User.UserRole,e.Action,e.Timestamp}).ToListAsync();

            return Ok(list);   
        }
    }
}