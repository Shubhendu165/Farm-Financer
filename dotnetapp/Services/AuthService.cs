using System.Text.Json;
using dotnetapp.Data;
using dotnetapp.Models;
using Microsoft.EntityFrameworkCore;
using Microsoft.AspNetCore.Identity;
using Microsoft.IdentityModel.Tokens;
using System.IdentityModel.Tokens.Jwt;
using System.Security.Claims;
using System.Text;
using System.Threading.Tasks;
using System;
using System.Collections.Generic;
using Microsoft.Extensions.Configuration;
using System.Net.Mail;
using System.Net;

namespace dotnetapp.Services
{
    public class AuthService : IAuthService
    {
        private readonly ApplicationDbContext _context;
        private readonly UserManager<ApplicationUser> _userManager;
        private readonly RoleManager<IdentityRole> _roleManager;
        private readonly IConfiguration _configuration;
        private readonly IUserLogService _userLogService;

        public AuthService(ApplicationDbContext context, UserManager<ApplicationUser> userManager, RoleManager<IdentityRole> roleManager, IConfiguration configuration, IUserLogService userLogService)
        {
            _context = context;
            _userManager = userManager;
            _roleManager = roleManager;
            _configuration = configuration;
            _userLogService = userLogService;
        }

                
        public async Task<(int, string)> Registration(User model, string role)
        {
            if (string.IsNullOrWhiteSpace(model.Email))
                return (0, "Email is required");

            var normalizedEmail = model.Email.ToUpper();
            var userExists = await _context.Users.SingleOrDefaultAsync(u => u.Email.ToUpper() == normalizedEmail);
            if (userExists != null)
            {
                await _userLogService.LogActionAsync(0, "Failed registration attempt - duplicate email");
                return (0, "User already exists");
            }

            var normalizedUsername = model.Username.ToUpper();
            var usernameExists = await _userManager.FindByNameAsync(normalizedUsername);
            if (usernameExists != null)
            {
                await _userLogService.LogActionAsync(0, "Failed registration attempt - duplicate username");
                return (0, "Username already exists");
            }

            var identityUser = new ApplicationUser
            {
                Email = model.Email,
                UserName = model.Username,
                PhoneNumber = model.MobileNumber,
                Name = model.Username
            };

            var result = await _userManager.CreateAsync(identityUser, model.Password);
            if (!result.Succeeded)
            {
                await _userLogService.LogActionAsync(0, "Failed registration attempt - identity creation failed");
                return (0, "User creation failed! Please check user details and try again");
            }

            if (!await _roleManager.RoleExistsAsync(role))
            {
                await _userLogService.LogActionAsync(0, $"Failed registration attempt - role '{role}' does not exist");
                return (0, $"Role '{role}' does not exist. Please create the role first.");
            }

            await _userManager.AddToRoleAsync(identityUser, role);

            // Save domain user model
            _context.Users.Add(model);
            await _context.SaveChangesAsync(); // This generates model.UserId

            // Now log with valid UserId
            await _userLogService.LogActionAsync(model.UserId, "Registration");

            return (1, "User created successfully!");
        }


        public async Task<(int, string)> Login(LoginModel model)
        {
            if (string.IsNullOrWhiteSpace(model.Email))
                return (0, "Email is required");

            var user = await _userManager.FindByEmailAsync(model.Email);
            if (user == null)
            {
                await _userLogService.LogActionAsync(0, "Failed login attempt");
                return (0, "Invalid email");
            }
            if (!await _userManager.CheckPasswordAsync(user, model.Password))
            {
                await _userLogService.LogActionAsync(0, "Failed login attempt");
                return (0, "Invalid password");
            }
            var userRoles = await _userManager.GetRolesAsync(user);
            var authClaims = new List<Claim>
            {
                new Claim(ClaimTypes.Name, user.UserName),
                new Claim(JwtRegisteredClaimNames.Jti, Guid.NewGuid().ToString()),
            };
            foreach (var userRole in userRoles){
                authClaims.Add(new Claim(ClaimTypes.Role, userRole));
            }
            var token = GenerateToken(authClaims);
            // Fetch recently saved user data from User Table
            var storedUser = await _context.Users.SingleOrDefaultAsync(u => u.Email == model.Email);
            if (storedUser == null)
                return (0, "User record not found in database");
            // Serialize Response with Token, User Details, and Role(s)
            var responseObject = new
            {
                token,
                user = new
                {
                    id = storedUser.UserId,  // Fetching user ID from DB
                    username = storedUser.Username,
                    email = storedUser.Email,
                    mobileNumber = storedUser.MobileNumber
                },
                role = userRoles[0]
            };
            await _userLogService.LogActionAsync(storedUser.UserId,"Login");
            string jsonResponse = JsonSerializer.Serialize(responseObject);
            return (1, jsonResponse);
        }

        private string GenerateToken(IEnumerable<Claim> claims)
        {
            try
            {
                var authSigningKey = new SymmetricSecurityKey(Encoding.UTF8.GetBytes(_configuration["Jwt:SecretKey"]));

                var token = new JwtSecurityToken(
                    issuer: _configuration["JWT:Issuer"],
                    audience: _configuration["JWT:Audience"],
                    claims: claims,
                    expires: DateTime.Now.AddHours(3),
                    signingCredentials: new SigningCredentials(authSigningKey, SecurityAlgorithms.HmacSha256)
                );

                return new JwtSecurityTokenHandler().WriteToken(token);
            }
            catch (Exception ex)
            {
                Console.WriteLine($"Token generation failed: {ex.Message}");
                return null;
            }
        }

        public async Task<bool> SendOtpAsync(string email)
        {
            var otp = new Random().Next(100000, 999999).ToString();

            var otpEntry = await _context.OtpStores.FirstOrDefaultAsync(o => o.Email == email);
            if (otpEntry != null)
            {
                otpEntry.Otp = otp;
                otpEntry.ExpiryTime = DateTime.UtcNow.AddMinutes(5);
            }
            else
            {
                _context.OtpStores.Add(new OtpStore
                {
                    Email = email,
                    Otp = otp,
                    ExpiryTime = DateTime.UtcNow.AddMinutes(5)
                });
            }

            await _context.SaveChangesAsync();

            // Send email using SMTP
            try
            {
                using (var smtpClient = new SmtpClient(_configuration["Smtp:Host"], int.Parse(_configuration["Smtp:Port"])))
                {
                    smtpClient.Credentials = new NetworkCredential(_configuration["Smtp:Username"], _configuration["Smtp:Password"]);
                    smtpClient.EnableSsl = true;

                    var mailMessage = new MailMessage
                    {
                        From = new MailAddress(_configuration["Smtp:SenderEmail"]),
                        Subject = "Your OTP Code",
                        Body = $"Your OTP code is: {otp}",
                        IsBodyHtml = false
                    };
                    mailMessage.To.Add(email);

                    smtpClient.Send(mailMessage);
                }

                return true;
            }
            catch (Exception ex)
            {
                Console.WriteLine("SMTP Error: " + ex.Message);
                return false;
            }
        }

        // OTP VERIFICATION
        public async Task<bool> VerifyOtpAsync(string email, string otp)
        {
            var otpEntry = await _context.OtpStores.FirstOrDefaultAsync(o => o.Email == email && o.Otp == otp);
            if (otpEntry != null && otpEntry.ExpiryTime > DateTime.UtcNow)
            {
                _context.OtpStores.Remove(otpEntry);
                await _userLogService.LogActionAsync(1,"Otp Verified");
                await _context.SaveChangesAsync();
                return true;
            }

            return false;
        }

    }
}
