// import { Component } from '@angular/core';
// import { Router } from '@angular/router';
// import { AuthService } from '../../services/auth.service';
// import Swal from 'sweetalert2';
// // import { environment } from 'src/environments/environment'; // Import environment variables
// import { environment } from 'src/app/environments/environment';
// @Component({
//   selector: 'app-login',
//   templateUrl: './login.component.html',
//   styleUrls: ['./login.component.css'],
// })
// export class LoginComponent {
//   credentials = { email: '', password: '', adminSecretKey: '' }; // Add secret key field
//   passwordFieldType: string = 'password'; 

//   constructor(private authService: AuthService, private router: Router) {}

//   onLogin(): void {
//     const loginPayload = {
//       email: this.credentials.email,
//       password: this.credentials.password
//     };

//     console.log('Login Payload:', loginPayload);
  
//     this.authService.login(loginPayload).subscribe({
//       next: (response: any) => {
//         localStorage.setItem('token', response.token);
//         const role = this.authService.getUserRoleFromToken(response.token);
//         console.log('Decoded Role:', role);
//         localStorage.setItem('userRole', role);
        
  
//         // Navigate to the role-specific route
//         if (role) {
//           this.router.navigate([`/${role}`]);
//           Swal.fire({
//             title: 'Success!',
//             text: `Successfully logged in as ${role}`,
//             icon: 'success',
//             confirmButtonText: 'OK'
//           });
//         } else {
//           Swal.fire({
//             title: 'Invalid Input!',
//             text: 'No Inputs Found. Please enter valid credentials.',
//             icon: 'error',
//             confirmButtonText: 'OK'
//           });
//         }
//       },
//       error: () => {
//         Swal.fire({
//           title: 'Error!',
//           text: 'Invalid credentials. Please try again.',
//           icon: 'error',
//           confirmButtonText: 'OK'
//         });
//       }
//     });
//   }
  

//   togglePasswordVisibility(): void {
//     this.passwordFieldType = this.passwordFieldType === 'password' ? 'text' : 'password';
//   }
// }

// FOR FINAL PRESENTATION
import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { AuthService } from '../../services/auth.service';
import Swal from 'sweetalert2';
import { environment } from 'src/app/environments/environment';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css'],
})
export class LoginComponent {
  credentials = { email: '', password: '', adminSecretKey: '' };
  passwordFieldType: string = 'password';
  captchaToken: string | null = null;

  constructor(private authService: AuthService, private router: Router) {}

  onLogin(): void {
    if (!this.captchaToken) {
      Swal.fire({
        title: 'CAPTCHA Required',
        text: 'Please verify you are human.',
        icon: 'warning',
        confirmButtonText: 'OK'
      });
      return;
    }

    const loginPayload = {
      email: this.credentials.email,
      password: this.credentials.password,
      captchaToken: this.captchaToken
    };

    console.log('Login Payload:', loginPayload);

    this.authService.login(loginPayload).subscribe({
      next: (response: any) => {
        localStorage.setItem('token', response.token);
        const role = this.authService.getUserRoleFromToken(response.token);
        console.log('Decoded Role:', role);
        localStorage.setItem('userRole', role);

        if (role) {
          this.router.navigate([`/${role}`]);
          Swal.fire({
            title: 'Success!',
            text: `Successfully logged in as ${role}`,
            icon: 'success',
            confirmButtonText: 'OK'
          });
        } else {
          Swal.fire({
            title: 'Invalid Input!',
            text: 'No Inputs Found. Please enter valid credentials.',
            icon: 'error',
            confirmButtonText: 'OK'
          });
        }
      },
      error: () => {
        Swal.fire({
          title: 'Error!',
          text: 'Invalid credentials. Please try again.',
          icon: 'error',
          confirmButtonText: 'OK'
        });
      }
    });
  }

  onCaptchaResolved(token: string): void {
    this.captchaToken = token;
    console.log('CAPTCHA Token:', token);
  }

  togglePasswordVisibility(): void {
    this.passwordFieldType = this.passwordFieldType === 'password' ? 'text' : 'password';
  }
}
