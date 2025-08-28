// import { Component, OnInit } from '@angular/core';
// import { Router } from '@angular/router';
// import { Loan } from 'src/app/models/loan.model';
// import { LoanApplication } from 'src/app/models/loanapplication.model';
// import { LoanService } from 'src/app/services/loan.service';
// import { AuthService } from 'src/app/services/auth.service';

// @Component({
//   selector: 'app-userviewloan',
//   templateUrl: './userviewloan.component.html',
//   styleUrls: ['./userviewloan.component.css']
// })
// export class UserviewloanComponent implements OnInit {

//   loans : Loan[] = [];
//   filteredLoans : Loan[] = this.loans;
//   userId : number;
//   appliedLoanIds : number[] = [];
  
//   constructor(private loanService : LoanService, private authService : AuthService, private router : Router) { 
//     this.userId = Number(localStorage.getItem('userId'));
//   }

//   ngOnInit(): void {
//     this.fetchLoans();
//   }

//   fetchLoans() : void{
//     this.loanService.getAllLoans().subscribe(
//       (loans : Loan[]) =>{
//         console.log('Fetched loans:', loans);
//         this.loans = loans;
//         this.filteredLoans = this.loans;
//         this.checkAppliedLoans();
//       },
//       error =>{
//         console.error('Error fetching loan data:', error);
//       }
//     );
//   }

//   applyForLoan(loanid : number) : void{
//     console.log('Applying for Loan ID:', loanid);
//     this.router.navigate([`loanform/${loanid}`]);

//   }

//   checkAppliedLoans() : void{
//     console.log('Checking applied loans for user:', this.userId);

//     this.loanService.getAppliedLoans(this.userId).subscribe(
//       (appliedLoans : LoanApplication[]) =>{
//         console.log('Received applied loans:', appliedLoans);
//         this.appliedLoanIds = appliedLoans.map(app => app.loanId);
//       },
//       error =>{
//         console.error('Error fetching applied loans:', error);
//       }
//     );
//   }

//   isLoanApplied(LoanId : number) : boolean{
//     return this.appliedLoanIds.includes(LoanId);
//   }

//   searchByLoanName(searchtxt : string) : void{
//     this.filteredLoans = this.loans.filter(loan =>
//       loan.loanType.toLowerCase().includes(searchtxt.toLowerCase())
//     );
//   }
// }

// import { Component, OnInit } from '@angular/core';
// import { Router } from '@angular/router';
// import { Loan } from 'src/app/models/loan.model';
// import { LoanApplication } from 'src/app/models/loanapplication.model';
// import { LoanService } from 'src/app/services/loan.service';
// import { AuthService } from 'src/app/services/auth.service';

// @Component({
//   selector: 'app-userviewloan',
//   templateUrl: './userviewloan.component.html',
//   styleUrls: ['./userviewloan.component.css']
// })
// export class UserviewloanComponent implements OnInit {

//   loans : Loan[] = [];
//   filteredLoans : Loan[] = this.loans;
//   userId : number;
//   paginatedLoans:Loan[]=[];
//   appliedLoanIds : number[] = [];

//   currentPage:number=1;
//   itemsPerPage : number = 10;
//   totalPages : number = 1;

  
//   constructor(private loanService : LoanService, private authService : AuthService, private router : Router) { 
//     this.userId = Number(localStorage.getItem('userId'));
//   }

//   ngOnInit(): void {
//     this.fetchLoans();
//   }

//   fetchLoans() : void{
//     this.loanService.getAllLoans().subscribe(
//       (loans : Loan[]) =>{
//         console.log('Fetched loans:', loans);
//         this.loans = loans;
//         this.filteredLoans = this.loans;
//         this.totalPages = Math.ceil(this.filteredLoans.length / this.itemsPerPage);
//         this.updatePaginatedLoans();
//         this.checkAppliedLoans();
//       },
//       error =>{
//         console.error('Error fetching loan data:', error);
//       }
//     );
//   }
  
//   updatePaginatedLoans(): void {
//    const startIndex = (this.currentPage - 1) * this.itemsPerPage;
//    const endIndex = startIndex + this.itemsPerPage;
//    this.paginatedLoans = this.filteredLoans.slice(startIndex, endIndex);
//   }

//   previousPage() : void{
//     if(this.currentPage > 1){
//       this.currentPage--;
//       this.updatePaginatedLoans();
//     }
//   }

//   nextPage() : void{
//     if(this.currentPage < this.totalPages){
//       this.currentPage++;
//       this.updatePaginatedLoans();
//     }
//   }
   




//   applyForLoan(loanid : number) : void{
//     console.log('Applying for Loan ID:', loanid);
//     this.router.navigate([`loanform/${loanid}`]);

//   }

//   checkAppliedLoans() : void{
//     console.log('Checking applied loans for user:', this.userId);

//     this.loanService.getAppliedLoans(this.userId).subscribe(
//       (appliedLoans : LoanApplication[]) =>{
//         console.log('Received applied loans:', appliedLoans);
//         this.appliedLoanIds = appliedLoans.map(app => app.loanId);
//       },
//       error =>{
//         console.error('Error fetching applied loans:', error);
//       }
//     );
//   }

//   isLoanApplied(LoanId : number) : boolean{
//     return this.appliedLoanIds.includes(LoanId);
//   }

//   searchByLoanName(searchtxt : string) : void{
//     this.filteredLoans = this.loans.filter(loan =>
//       loan.loanType.toLowerCase().includes(searchtxt.toLowerCase())
//     );
//     this.totalPages = Math.ceil(this.filteredLoans.length / this.itemsPerPage);
//     this.currentPage = 1;
//     this.updatePaginatedLoans();

//   }
// }




// implementing Ag-grid

import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { Loan } from 'src/app/models/loan.model';
import { LoanApplication } from 'src/app/models/loanapplication.model';
import { LoanService } from 'src/app/services/loan.service';
import { AuthService } from 'src/app/services/auth.service';
import { ColDef } from 'ag-grid-community';

@Component({
  selector: 'app-userviewloan',
  templateUrl: './userviewloan.component.html',
  styleUrls: ['./userviewloan.component.css']
})
export class UserviewloanComponent implements OnInit {
  loans: Loan[] = [];
  filteredLoans: Loan[] = [];
  userId: number;
  appliedLoanIds: number[] = [];

  columnDefs: ColDef[] = [
    { headerName: 'S No.', valueGetter: 'node.rowIndex + 1', width: 80 },
    { headerName: 'Loan Type', field: 'loanType' },
    { headerName: 'Loan Description', field: 'description' },
    { headerName: 'Interest Rate', field: 'interestRate' },
    { headerName: 'Maximum Amount', field: 'maximumAmount' },
    { headerName: 'Repayment Tenure (Months)', field: 'repaymentTenure' },
    { headerName: 'Eligibility', field: 'eligibility' },
    { headerName: 'Documents Required', field: 'documentsRequired' },
    {
      headerName: 'Action',
      cellRenderer: this.actionCellRenderer.bind(this),
      width: 120
    }
  ];

  defaultColDef: ColDef = {
    sortable: true,
    filter: true,
    resizable: true
  };

  constructor(
    private loanService: LoanService,
    private authService: AuthService,
    private router: Router
  ) {
    this.userId = Number(localStorage.getItem('userId'));
  }

  ngOnInit(): void {
    this.fetchLoans();

    document.addEventListener('applyLoan', (e: any) => this.applyForLoan(e.detail));
  }

  fetchLoans(): void {
    this.loanService.getAllLoans().subscribe(
      (loans: Loan[]) => {
        this.loans = loans;
        this.filteredLoans = loans;
        this.checkAppliedLoans();
      },
      error => {
        console.error('Error fetching loan data:', error);
      }
    );
  }

  applyForLoan(loanId: number): void {
    this.router.navigate([`loanform/${loanId}`]);
  }

  checkAppliedLoans(): void {
    this.loanService.getAppliedLoans(this.userId).subscribe(
      (appliedLoans: LoanApplication[]) => {
        this.appliedLoanIds = appliedLoans.map(app => app.loanId);
      },
      error => {
        console.error('Error fetching applied loans:', error);
      }
    );
  }

  isLoanApplied(loanId: number): boolean {
    return this.appliedLoanIds.includes(loanId);
  }

  searchByLoanName(searchtxt: string): void {
    this.filteredLoans = this.loans.filter(loan =>
      loan.loanType.toLowerCase().includes(searchtxt.toLowerCase())
    );
  }

  actionCellRenderer(params: any): HTMLElement {
    const isApplied = this.isLoanApplied(params.data.loanId);
    const button = document.createElement('button');
    button.innerText = isApplied ? 'Applied' : 'Apply';
    button.disabled = isApplied;
    button.style.backgroundColor = isApplied ? 'green' : '#007bff';
    button.style.color = 'white';
    button.style.border = 'none';
    button.style.padding = '5px 10px';
    button.style.cursor = isApplied ? 'not-allowed' : 'pointer';
  
    if (!isApplied) {
      button.addEventListener('click', () => {
        this.applyForLoan(params.data.loanId);
      });
    }
  
    return button;
  }
  
}




