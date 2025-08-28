using System;
using Microsoft.AspNetCore.Identity;
using System.ComponentModel.DataAnnotations;

namespace dotnetapp.Models
{
    public class ApplicationUser : IdentityUser
    {
        [MaxLength(100,ErrorMessage ="Name cannot exceed 100 characters.")]
        public string Name {get; set;} //=string.Empty;
    }
}