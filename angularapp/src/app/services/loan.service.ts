import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Loan } from '../models/loan.model';
import { LoanApplication } from '../models/loanapplication.model';


import { AuthService } from './auth.service';
import { environment } from '../environments/environment';


@Injectable({
  providedIn: 'root'
})


export class LoanService {



  private apiUrl = environment.apiUrl;
  constructor(private http: HttpClient, private authService: AuthService) {}

 

  private getHeaders(): HttpHeaders {
    const token = this.authService.getToken();
    return new HttpHeaders({ 'Authorization': `Bearer ${token}` });
  }

  getAllLoans(): Observable<Loan[]> {
    return this.http.get<Loan[]>(`${this.apiUrl}/api/loan`, { headers: this.getHeaders() });
  }

  deleteLoan(loanId: number): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/api/loan/${loanId}`, { headers: this.getHeaders() });
  }

  getLoanById(id: number): Observable<Loan> {
    return this.http.get<Loan>(`${this.apiUrl}/api/loan/${id}`, { headers: this.getHeaders() });
  }

  addLoan(requestObject: Loan): Observable<Loan> {
    return this.http.post<Loan>(`${this.apiUrl}/api/loan`, requestObject, { headers: this.getHeaders() });
  }

  updateLoan(id: number, requestObject: Loan): Observable<Loan> {
    return this.http.put<Loan>(`${this.apiUrl}/api/loan/${id}`, requestObject, { headers: this.getHeaders() });
  }

  getAppliedLoans(userId: number): Observable<LoanApplication[]> {
    return this.http.get<LoanApplication[]>(`${this.apiUrl}/api/loan-application/user/${userId}`, { headers: this.getHeaders() });
  }

  
  deleteLoanApplication(loanId: number): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/api/loan-application/${loanId}`, { headers: this.getHeaders() });
  }

  addLoanApplication(data: LoanApplication): Observable<LoanApplication> {
    return this.http.post<LoanApplication>(`${this.apiUrl}/api/loan-application`, data, { headers: this.getHeaders() });
  }

  getAllLoanApplications(): Observable<LoanApplication[]> {
    return this.http.get<LoanApplication[]>(`${this.apiUrl}/api/loan-application`, { headers: this.getHeaders() });
  }

  updateLoanStatus(id: number, loanApplication: LoanApplication): Observable<LoanApplication> {
    return this.http.put<LoanApplication>(`${this.apiUrl}/api/loan-application/${id}`, loanApplication, { headers: this.getHeaders() });
  }


  removeLoanReferences(loanId: number): Observable<void> {
    return this.http.put<void>(`${this.apiUrl}/api/loan-application/remove-loan-references/${loanId}`, {}, { headers: this.getHeaders() });
  }
}