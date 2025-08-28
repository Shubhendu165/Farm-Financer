import { Component, OnInit } from '@angular/core';
import { AuthService } from 'src/app/services/auth.service'; // Ensure the correct path to the AuthService

@Component({
  selector: 'app-adminnav',
  templateUrl: './adminnav.component.html',
  styleUrls: ['./adminnav.component.css']
})
export class AdminnavComponent implements OnInit {

  constructor(private authService: AuthService) {}

  ngOnInit(): void {
  }

  logout(): void {
    this.authService.logout();
    //this.router.navigate(['/login']);
    window.location.href= '/login';
  }
  // Add dropdown toggle functionality
  toggleDropdown(event: Event): void {
    event.preventDefault();
    const dropdown = (event.currentTarget as HTMLElement).closest('.dropdown');
    if (dropdown) {
      dropdown.classList.toggle('show');
    }
  }
}