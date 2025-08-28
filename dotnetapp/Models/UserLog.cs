using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;
using System.Text.Json.Serialization;
namespace dotnetapp.Models
{
    public class UserLog
    {
        [Key]
        public int LogId { get; set; }  

        public int UserId { get; set; }

        public string Action { get; set; }
    
        public DateTime Timestamp { get; set; }

        [ForeignKey("UserId")]
        // [JsonIgnore]
        public User? User { get; set; }
    }
}