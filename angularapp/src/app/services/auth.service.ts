import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable, BehaviorSubject } from 'rxjs';
import { environment } from '../environments/environment';

@Injectable({
  providedIn: 'root',
})
export class AuthService {


  private apiUrl = environment.apiUrl;

  private currentUserRole = new BehaviorSubject<string | null>(null);

  constructor(private http: HttpClient) {
    const token = localStorage.getItem('token');
    if (token) {
      this.currentUserRole.next(this.getUserRoleFromToken(token));
    }
  }

  login(credentials: { email: string; password: string }): Observable<any> {
    return new Observable(observer => {
      this.http.post<any>(`${this.apiUrl}/api/login`, credentials).subscribe(
        response => {
          localStorage.setItem('token', response.token);
          const role = this.getUserRoleFromToken(response.token);
          console.log("Decoded Role:", role); // Logging for debugging
          const userId = response.user.id; // Extracting UserId
          console.log("UserId:", userId); // Logging for debugging
          localStorage.setItem('userRole', role);
          localStorage.setItem('userId', userId); // Storing UserId in local storage
          this.currentUserRole.next(role);
          observer.next(response);
          observer.complete();
        },
        error => {
          console.log("Error at AuthService");
          observer.error(error);
        }
      );
    });
  }

  register(user: any): Observable<any> {
    return this.http.post<any>(`${this.apiUrl}/api/register`, user, {
      headers: new HttpHeaders({
        'Content-Type': 'application/json'
      }),
      responseType: 'text' as 'json'
    });
  }

  isLoggedIn(): boolean {
    return !!localStorage.getItem('token');
  }

  logout(): void {
    localStorage.removeItem('token');
    localStorage.removeItem('userRole');
    localStorage.removeItem('userId'); // Removing UserId from local storage
    this.currentUserRole.next(null);
  }

  getUserRole(): string | null {
    return localStorage.getItem('userRole');
  }

  setUserRole(role: string): void {
    localStorage.setItem('userRole', role);
  }

  public getUserRoleFromToken(token: string): string {
    try {
      const payload = JSON.parse(atob(token.split('.')[1])); // Decode the JWT payload
      console.log("Decoded Payload:", payload); // Log payload for debugging

      // Log all fields in the payload to verify the structure
      Object.keys(payload).forEach(key => {
        console.log(`${key}: ${payload[key]}`);
      });

      // Extract the UserRole from common claim URIs
      const role = payload["http://schemas.microsoft.com/ws/2008/06/identity/claims/role"];
      console.log("Extracted Role:", role);
      return role || null;
    } catch (error) {
      console.error("Error decoding token:", error);
      return null;
    }
  }

  public getUserIdFromToken(token: string): string {
    try {
      const payload = JSON.parse(atob(token.split('.')[1])); // Decode the JWT payload
      console.log("Decoded Payload:", payload); // Log payload for debugging

      // Log all fields in the payload to verify the structure
      Object.keys(payload).forEach(key => {
        console.log(`${key}: ${payload[key]}`);
      });

      // Extract the UserId from common claim URIs
      const userId = payload["http://schemas.xmlsoap.org/ws/2005/05/identity/claims/nameidentifier"];
      console.log("Extracted UserId:", userId);
      return userId || null;
    } catch (error) {
      console.error("Error decoding token:", error);
      return null;
    }
  }

  getCurrentUserRole(): Observable<string | null> {
    return this.currentUserRole.asObservable();
  }

  getToken(): string | null {
    return localStorage.getItem('token');
  }

  isAdmin(): boolean {
    const role = this.getUserRole();
    return role === 'Admin';
  }

  isUser(): boolean {
    const role = this.getUserRole();
    return role === 'User';
  }

  sendOtp(email: string): Observable<any> {
 
    const headers = new HttpHeaders({ 'Content-Type': 'application/json' });
 
    const url = `${this.apiUrl}/api/send-otp?email=${encodeURIComponent(email)}`;
 
    return this.http.post(url, {}, { headers });
 
  }
 
  // ✅ Verify OTP with email and otp in body
 
  verifyOtp(email: string, otp: string): Observable<boolean> {
 
    const headers = new HttpHeaders({ 'Content-Type': 'application/json' });
 
    return this.http.post<boolean>(`${this.apiUrl}/api/verify-otp`, { email, otp }, { headers });
 
  }
}