using dotnetapp.Models;
using dotnetapp.Services;
using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.Authorization;
namespace dotnetapp.Controllers
{
    [ApiController]
    [Route("api/feedback")]
    public class FeedbackController : ControllerBase
    {
        private readonly FeedbackService _feedbackService;
        public FeedbackController(FeedbackService feedbackService)
        {
            _feedbackService = feedbackService;
        }
    
        [HttpGet]
        [Authorize(Roles = "Admin")]   
        public async Task<IActionResult> GetAllFeedbacks()
        {
            try
            {
                var feedbacks = await _feedbackService.GetAllFeedbacks();
                return Ok(feedbacks);
            }
            catch (Exception ex)
            {
                return StatusCode(500, ex.Message);
            }
        }

        [HttpGet("user/{userId}")]
        [Authorize(Roles = "User")]   
        public async Task<IActionResult> GetFeedbacksByUserId(int userId)
        {
            try
            {
                var feedbacks = await _feedbackService.GetFeedbacksByUserId(userId);
                return Ok(feedbacks);
            }
            catch (Exception ex)
            {
                return StatusCode(500, ex.Message);
            }
        }

        [HttpPost]
        [Authorize(Roles = "User")]   
        public async Task<IActionResult> AddFeedback([FromBody] Feedback feedback)
        {
            try
            {
                await _feedbackService.AddFeedback(feedback);
                var response = new { message = "Feedback added successfully" };
                return Ok(response);
            }
            catch (Exception ex)
            {
                var errorResponse = new { message = ex.Message };
                return StatusCode(500, errorResponse);
            }
        }

        [HttpDelete("{feedbackId}")]
        [Authorize(Roles = "User")]   
        public async Task<IActionResult> DeleteFeedback(int feedbackId)
        {
            try
            {
                var deleted = await _feedbackService.DeleteFeedback(feedbackId);
                if (!deleted)
                {
                    var errorResponse = new { message = "Feedback not found" };
                    return NotFound(errorResponse);
                }

                var response = new { message = "Feedback deleted successfully" };
                return Ok(response); // Return the response object as JSON
            }
            catch (Exception ex)
            {
                var errorResponse = new { message = ex.Message }; // Create an error response object
                return StatusCode(500, errorResponse); // Return the error response object as JSON
            }
        }

        [HttpGet("username/{userId}")]
        [Authorize(Roles = "Admin, User")]   
        public async Task<IActionResult> GetUsernameByUserId(int userId)
        {
            try
            {
                var username = await _feedbackService.GetUsernameByUserId(userId);
                if (string.IsNullOrEmpty(username))
                {
                    return NotFound("User not found");
                }
                return Ok(new { Username = username });
            }
            catch (Exception ex)
            {
                return StatusCode(500, ex.Message);
            }
        }
    }
}