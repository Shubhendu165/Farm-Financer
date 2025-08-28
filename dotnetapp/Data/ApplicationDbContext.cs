using System;
using System.Collections.Generic;
using System.Diagnostics;
using System.Linq;
using System.Reflection.Emit;
using System.Threading.Tasks;
using dotnetapp.Models;
using Microsoft.EntityFrameworkCore;
using Microsoft.AspNetCore.Identity;
using Microsoft.AspNetCore.Identity.EntityFrameworkCore;

namespace dotnetapp.Data
{
    public class ApplicationDbContext : IdentityDbContext<ApplicationUser>
    {
        public ApplicationDbContext(DbContextOptions<ApplicationDbContext> options) : base(options){}

        public DbSet<User> Users {get;set;}
        public DbSet<Loan> Loans {get;set;}
        public DbSet<LoanApplication> LoanApplications {get; set;}
        public DbSet<Feedback> Feedbacks {get; set;}
        public DbSet<OtpStore> OtpStores {get; set;}
        public DbSet<UserLog> UserLogs { get; set; }
        protected override void OnModelCreating(ModelBuilder modelBuilder){
            base.OnModelCreating(modelBuilder);
            
            modelBuilder.Entity<LoanApplication>()
                .HasOne(la=>la.User)
                .WithMany(u=>u.LoanApplications)
                .HasForeignKey(la=>la.UserId);
            
           
            modelBuilder.Entity<LoanApplication>()
                .HasOne(la=>la.Loan)
                .WithMany(l=>l.LoanApplications)
                .HasForeignKey(la=>la.LoanId);

            modelBuilder.Entity<Feedback>()
                .HasOne(fb=>fb.User)
                .WithMany(u=>u.Feedbacks)
                .HasForeignKey(fb=>fb.UserId)
                .OnDelete(DeleteBehavior.Cascade);
        }
    }
}