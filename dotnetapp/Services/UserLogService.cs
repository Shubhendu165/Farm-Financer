using dotnetapp.Data;
using dotnetapp.Models;
using Microsoft.EntityFrameworkCore;
namespace dotnetapp.Services{
    public class UserLogService : IUserLogService
    {
        private readonly ApplicationDbContext _context;
        public UserLogService(ApplicationDbContext context)
        {
            _context = context;
        }
        public async Task LogActionAsync(int userId, string action)
        {
            
            var indiaTimeZone = TimeZoneInfo.FindSystemTimeZoneById("India Standard Time");
            var istTime = TimeZoneInfo.ConvertTimeFromUtc(DateTime.UtcNow, indiaTimeZone);

            var log = new UserLog
            {
                UserId = userId,
                Action = action,
                Timestamp = istTime
            };
            await _context.UserLogs.AddAsync(log);
            await _context.SaveChangesAsync();
        }
    }
}
