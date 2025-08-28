import { Component, OnInit } from '@angular/core';
import { AuthService } from 'src/app/services/auth.service';
import { Router } from '@angular/router';
import { LoanService } from 'src/app/services/loan.service';
import { LoanApplication } from 'src/app/models/loanapplication.model';
import { Loan } from 'src/app/models/loan.model';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-requestedloan',
  templateUrl: './requestedloan.component.html',
  styleUrls: ['./requestedloan.component.css']
})
export class RequestedloanComponent implements OnInit {
  loanRequests: LoanApplication[] = [];
  filteredLoanRequests: LoanApplication[] = [];
  loans: { [key: number]: Loan } = {}; // Store loans in an object with Loan ID as the key
  selectedLoan: LoanApplication | null = null;
  filterStatus: string | 'all' = 'all';
  searchText: string = '';
  showPopup: boolean = false;
  


  constructor(
    private authService: AuthService,
    private loanService: LoanService,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.fetchLoanRequests();
  }

  fetchLoanRequests() {
    this.loanService.getAllLoanApplications().subscribe({
      next: (loanApplications: LoanApplication[]) => {
        this.loanRequests = loanApplications.map(loanApp => {
          if (loanApp.loanStatus === undefined || loanApp.loanStatus === null) {
            loanApp.loanStatus = 0; // Default to Pending
          }
          return loanApp;
        });
        this.filteredLoanRequests = this.loanRequests;
        this.fetchLoanDetails();
      },
      error: (error) => {
        console.error("Error fetching loan applications:", error);
      }
    });
  }

  fetchLoanDetails(): void {
    this.loanRequests.forEach(loanApp => {
      if (loanApp.loanId) {
        this.loanService.getLoanById(loanApp.loanId).subscribe({
          next: (loan: Loan) => {
            this.loans[loanApp.loanId] = loan;
            console.log(this.loans[loanApp.loanId]);
            console.log(loan);
            this.filterLoans(); // Apply filters after fetching each loan
          },
          error: (error) => {
            console.error(`Error fetching loan with ID ${loanApp.loanId}:`, error);

          }
        });
      }
    });
  }

  filterLoans() {
    this.filteredLoanRequests = this.loanRequests.filter(loanRequest => {
      const matchesStatus = this.filterStatus === 'all' || loanRequest.loanStatus.toString() === this.filterStatus;
      const matchesSearch = this.loans[loanRequest.loanId]?.loanType.toLowerCase().includes(this.searchText.toLowerCase());
      // const matchesSearch = this.loans[loanRequest.LoanId]?.LoanType.toLowerCase().includes(this.searchText.toLowerCase());
      return matchesStatus && matchesSearch;
    });
  }

  approveLoan(index: number, loanApplication: LoanApplication) {
    if (loanApplication.loanStatus === 2) {
      console.error("Cannot approve a rejected loan.");
      return;
    }
    loanApplication.loanStatus = 1; // Approved
    Swal.fire({
      title: 'LOAN APPROVED!',
      text: 'Loan have been approved successfully!',
      icon: 'success',
      confirmButtonText: 'OK'
    });
    this.loanService.updateLoanStatus(loanApplication.loanApplicationId!, loanApplication).subscribe({
      next: (updatedLoan: LoanApplication) => {
        this.loanRequests[index] = updatedLoan;
        this.filterLoans(); // Update the filtered list after status change
      },
      error: (error) => {
        console.error("Error approving loan:", error);
      }
    });
  }

  rejectLoan(index: number, loanApplication: LoanApplication): void {
    const { loanStatus, loanApplicationId } = loanApplication;
  
    if (loanStatus === 1) {
      console.error("Cannot reject an approved loan.");
      return;
    }
  
    loanApplication.loanStatus = 2; // Set status to Rejected
  
    this.loanService.updateLoanStatus(loanApplicationId!, loanApplication).subscribe({
      next: (updatedLoan: LoanApplication) => {
        Swal.fire({
          title: 'Loan Rejected!',
          text: 'The loan application has been successfully rejected.',
          icon: 'success', // Fixed typo: 'sucess' → 'success'
          confirmButtonText: 'OK'
        });
  
        this.loanRequests[index] = updatedLoan;
        this.filterLoans(); // Refresh the filtered list
      },
      error: (err) => {
        console.error("Failed to reject loan:", err);
        Swal.fire({
          title: 'Error',
          text: 'An error occurred while rejecting the loan.',
          icon: 'error',
          confirmButtonText: 'OK'
        });
      }
    });
  }
  

  showMore(loanApplication: LoanApplication) {
    const formattedDate = loanApplication.submissionDate 
    
      ? new Date(loanApplication.submissionDate).toLocaleDateString()
      : 'Not Available';

    Swal.fire({
      title: 'Loan Nominee Profile!',
      html: `
      <div style="text-align: center;">
      <p><strong>Loan Application ID:</strong> ${loanApplication?.loanApplicationId ?? 'Not Available'}</p>
        <p ><strong>Farm Purpose:</strong> ${loanApplication.farmPurpose?? 'Unknown'}</p>
        <p><strong>Farmer Address:</strong> ${loanApplication?.farmerAddress}</p>
        <p><strong>Farm in Acres:</strong> ${loanApplication?.farmSizeInAcres}</p>
        <p><strong>Loan Application Date :</strong> ${formattedDate}</p>
      </div>
    `,
    icon: 'info',
    confirmButtonText: 'Close Profile'
    })
    this.selectedLoan = loanApplication;
  }

  closeModal() {
    this.selectedLoan = null;
  }

  logout() {
    this.authService.logout();
    this.router.navigate(['/login']);
  }

  onStatusChange(newStatus: string) {
    this.filterStatus = newStatus;
    this.filterLoans();
  }

  onSearchChange(searchText: string) {
    this.searchText = searchText;
    this.filterLoans();
  }
}