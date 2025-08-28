using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using dotnetapp.Models;
using dotnetapp.Data;
using Microsoft.EntityFrameworkCore;
using dotnetapp.Exceptions;

namespace dotnetapp.Services
{
    public class LoanApplicationService
    {
        private readonly ApplicationDbContext _context;
        private readonly IUserLogService _userLogService;
        public LoanApplicationService(ApplicationDbContext context,IUserLogService userLogService)
        {
            _context = context;
            _userLogService=userLogService;
        }

        public async Task<IEnumerable<LoanApplication>> GetAllLoanApplications(){
            return await _context.LoanApplications.Include(la => la.Loan).Include(la => la.User).ToListAsync();
        }

        public async Task<IEnumerable<LoanApplication>> GetLoanApplicationsByUserId(int userId){
            return await _context.LoanApplications
            .Where(la => la.UserId == userId)
            .Include(la => la.Loan)
            .Include(la=>la.User)
            .ToListAsync();
        }

        public async Task<bool> AddLoanApplication(LoanApplication loanApplication){
            var exists = await _context.LoanApplications.FirstOrDefaultAsync(la => la.UserId == loanApplication.UserId  && la.LoanId == loanApplication.LoanId);
            if(exists != null){
                throw new LoanException("User already applied for this loan");
            }
            _context.LoanApplications.Add(loanApplication);
            await _context.SaveChangesAsync();
            await _userLogService.LogActionAsync(loanApplication.UserId,"Applied for a Loan");
            return true;
        }

        public async Task<bool> UpdateLoanApplication(int loanApplicationId, LoanApplication loanApplication){
            var existingLoanApplication = await _context.LoanApplications.FindAsync(loanApplicationId);
            if(existingLoanApplication == null) return false;

            existingLoanApplication.LoanStatus = loanApplication.LoanStatus;
            existingLoanApplication.FarmLocation = loanApplication.FarmLocation;
            existingLoanApplication.FarmerAddress = loanApplication.FarmerAddress;
            existingLoanApplication.FarmSizeInAcres = loanApplication.FarmSizeInAcres;
            existingLoanApplication.FarmPurpose = loanApplication.FarmPurpose;
            existingLoanApplication.File = loanApplication.File;

            await _context.SaveChangesAsync();
            await _userLogService.LogActionAsync(loanApplication.UserId,"Updated the details of Loan Application");
            return true;
        }

        public async Task<bool> DeleteLoanApplication(int loanApplicationId){
            var loanApplication = await _context.LoanApplications.FindAsync(loanApplicationId);
            if(loanApplication == null) return false;

            _context.LoanApplications.Remove(loanApplication);
            await _context.SaveChangesAsync();
            await _userLogService.LogActionAsync(loanApplication.UserId,"Deleted the application for a Loan");
            return true;
        }
    }
}