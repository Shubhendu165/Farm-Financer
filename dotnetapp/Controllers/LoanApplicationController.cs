using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.Authorization;

using dotnetapp.Services;
using dotnetapp.Models;
using dotnetapp.Exceptions;

namespace dotnetapp.Controllers
{
    [ApiController]
    [Route("api/loan-application")]
    public class LoanApplicationController : ControllerBase
    {
        private readonly LoanApplicationService _loanApplicationService;

        public LoanApplicationController(LoanApplicationService loanApplicationService)
        {
            _loanApplicationService = loanApplicationService;
        }

        [HttpGet]
        [Authorize(Roles = "Admin")]
        public async Task<ActionResult<IEnumerable<LoanApplication>>> GetAllLoanApplications()
        {
            try
            {
                var loanApplications = await _loanApplicationService.GetAllLoanApplications();
                return Ok(loanApplications);
            }
            catch (Exception ex)
            {
                return StatusCode(500, new { message = $"Internal server error: {ex.Message}" });
            }
        }

        [HttpGet("user/{userId}")]
        [Authorize(Roles = "User")]
        public async Task<ActionResult<IEnumerable<LoanApplication>>> GetLoanApplicationsByUserId(int userId)
        {
            try
            {
                var loanApplications = await _loanApplicationService.GetLoanApplicationsByUserId(userId);
                if (loanApplications == null || !loanApplications.Any())
                {
                    return NotFound(new { message = "Cannot find any loan application" });
                }
                return Ok(loanApplications);
            }
            catch (Exception ex)
            {
                return StatusCode(500, new { message = $"Internal server error: {ex.Message}" });
            }
        }

        [HttpPost]
        [Authorize(Roles = "User")]
        public async Task<ActionResult> AddLoanApplication([FromBody] LoanApplication loanApplication)
        {
            try
            {
                var success = await _loanApplicationService.AddLoanApplication(loanApplication);
                if (success)
                {
                    return Ok(new { message = "Loan Application added successfully" });
                }
                return BadRequest(new { message = "Failed to add loan application" });
            }
            catch (LoanException ex)
            {
                return BadRequest(new { message = ex.Message });
            }
            catch (Exception ex)
            {
                return StatusCode(500, new { message = $"Internal server error: {ex.Message}" });
            }
        }

        [HttpPut("{loanApplicationId}")]
        [Authorize(Roles = "Admin , User")]
        public async Task<ActionResult> UpdateLoanApplication(int loanApplicationId, [FromBody] LoanApplication loanApplication)
        {
            try
            {
                var success = await _loanApplicationService.UpdateLoanApplication(loanApplicationId, loanApplication);
                if (success)
                {
                    return Ok(new { message = "Loan application updated successfully" });
                }
                return NotFound(new { message = "Cannot find any loan application" });
            }
            catch (Exception ex)
            {
                return StatusCode(500, new { message = $"Internal server error: {ex.Message}" });
            }
        }

        [HttpDelete("{loanApplicationId}")]
        [Authorize(Roles = "User")]
        public async Task<ActionResult> DeleteLoanApplication(int loanApplicationId)
        {
            try
            {
                var success = await _loanApplicationService.DeleteLoanApplication(loanApplicationId);
                if (success)
                {
                    return Ok(new { message = "Loan Application deleted successfully" });
                }
                return NotFound(new { message = "Cannot find any loan application" });
            }
            catch (LoanException ex)
            {
                return BadRequest(new { message = ex.Message });
            }
            catch (Exception ex)
            {
                return StatusCode(500, new { message = $"Internal server error: {ex.Message}" });
            }
        }

         [HttpPost("application/upload")]
        public async Task<ActionResult> UploadImage([FromForm] IFormFile file)
        {
            Console.WriteLine("Inside UploadImage");
            if (file == null || file.Length == 0)
            {
                return BadRequest("No file uploaded.");
            }
 
            var uploadsDirectory = Path.Combine("/home/coder/project/workspace/angularapp/src/assets");
            if (!Directory.Exists(uploadsDirectory))
            {
                Directory.CreateDirectory(uploadsDirectory);
            }
 
            // Ensure the file name is sanitized to avoid path traversal issues
            var fileName = Path.GetFileName(file.FileName);
            var filePath = Path.Combine(uploadsDirectory, fileName);
 
            // Use 'using' statement to ensure proper disposal of FileStream
            await using (var stream = new FileStream(filePath, FileMode.Create))
            {
                await file.CopyToAsync(stream);
            }
 
            var imageUrl = $"/assets/{fileName}";
            return Ok(new { ImageUrl = imageUrl });
        }
 
        
    }
      
}