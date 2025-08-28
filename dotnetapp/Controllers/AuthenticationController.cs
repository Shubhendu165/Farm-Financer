using Microsoft.AspNetCore.Mvc;
using System;
using System.Threading.Tasks;
using dotnetapp.Models;
using dotnetapp.Services;
 
namespace dotnetapp.Controllers
{
    [ApiController]
    [Route("api/")]
    public class AuthenticationController : ControllerBase
    {
        private readonly IAuthService _authService;
 
        public AuthenticationController(IAuthService authService)
        {
            _authService = authService;
        }
 
        [HttpPost]
        [Route("login")]
        public async Task<IActionResult> Login([FromBody] LoginModel model)
        {
            try
            {
                if (!ModelState.IsValid)
                {
                    return BadRequest("Invalid payload");
                }
 
                var (code, message) = await _authService.Login(model);
                if (code == 0)
                {
                    return StatusCode(401, message);
                }
 
                return Ok(message);
            }
            catch (Exception ex)
            {
                return StatusCode(500, ex.Message);
            }
        }
 
        [HttpPost]
        [Route("register")]
        public async Task<IActionResult> Register([FromBody] User model)
        {
            try
            {
                if (!ModelState.IsValid)
                {
                    return BadRequest("Invalid payload");
                }
 
                var (code, message) = await _authService.Registration(model, model.UserRole);
                if (code == 0)
                {
                    return StatusCode(500, message);
                }
 
                return Ok(message);
            }
            catch (Exception ex)
            {
                return StatusCode(500, ex.Message);
            }
        }

        [HttpPost("send-otp")]
 
        public async Task<IActionResult> SendOtp([FromQuery] string email)
 
        {
 
            var sent = await _authService.SendOtpAsync(email);
 
            if (!sent)
 
                return StatusCode(500, new { message = "Failed to send OTP. Please try again." });
 
            return Ok(new { message = "OTP sent successfully to email." });
 
        }
 
        // ✅ POST: api/Auth/verify-otp
 
        [HttpPost("verify-otp")]
 
        public async Task<IActionResult> VerifyOtp([FromBody] OtpVerifyModel model)
 
        {
 
            var isValid = await _authService.VerifyOtpAsync(model.Email, model.Otp);
 
            if (!isValid)
 
                return BadRequest(new { message = "Invalid or expired OTP." });
 
            return Ok(new { message = "OTP verified successfully." });
 
        }
 
    }
}