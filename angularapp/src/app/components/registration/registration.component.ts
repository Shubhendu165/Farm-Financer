// import { Component, OnInit } from '@angular/core';
// import { Router } from '@angular/router';
// import { AuthService } from 'src/app/services/auth.service';
// import { NgForm } from '@angular/forms';
// import Swal from 'sweetalert2';
// import { User } from 'src/app/models/user.model';
// import { environment } from 'src/app/environments/environment';

// @Component({
//   selector: 'app-registration',
//   templateUrl: './registration.component.html',
//   styleUrls: ['./registration.component.css']
// })
// export class RegistrationComponent implements OnInit {
//   registrationData: User = {
//     Username: '',
//     Email: '',
//     Password: '',
//     MobileNumber: '',
//     UserRole: ''
//   };
//   confirmPassword: string = '';
//   isPasswordStrong: boolean = false;
//   passwordError = '';
//   isConfirm: boolean = false;
//   error = '';
//   adminSecretKey: string = ''; // Add this for Admin key input

//   passwordFieldType: string = 'password';
//   confirmPasswordFieldType: string = 'password';

//   constructor(private authService: AuthService, private router: Router) {}

//   ngOnInit(): void {}

//   validatePassword() {
//     const password = this.registrationData.Password;
//     const regex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/;
//     this.isPasswordStrong = regex.test(password);

//    this.passwordError = this.isPasswordStrong
//       ? ''
//       : "Password must contain at least one uppercase, one lowercase, one number, one special character, and be at least 8 characters long.";
//   }

//   passwordMatch() {
//     this.isConfirm = this.registrationData.Password === this.confirmPassword;
//     this.error = this.isConfirm ? '' : "*Passwords do not match";
//   }

//   validateEmail(): boolean {
//     const email = this.registrationData.Email;
//     const regex = /^[^\s@]+@gmail\.com$/;
//     return regex.test(email);
//   }

//   validateMobileNumber(): boolean {
//     const mobileNumber = this.registrationData.MobileNumber;
//     const regex = /^[6-9]\d{9}$/;
//     return regex.test(mobileNumber);
//   }

//   onRegister() {
//     if (!this.registrationData.Username || 
//         !this.registrationData.Email || 
//         !this.registrationData.Password || 
//         !this.registrationData.MobileNumber || 
//         !this.registrationData.UserRole) {
//       alert("All fields are required.");
//       return;
//     }

//     // Admin key validation
//     if (this.registrationData.UserRole === 'Admin') {
//       if (!this.adminSecretKey) {
//         alert("Admin Key is required for Admin registration.");
//         return;
//       }

//       if (this.adminSecretKey !== environment.adminSecretKey) {
//         Swal.fire({
//           title: 'Access Denied!',
//           text: 'Invalid Admin Key. You are not authorized.',
//           icon: 'error',
//           confirmButtonText: 'OK'
//         });
//         return;
//       }
//     }

//     if (!this.validateEmail()) {
//       alert('Invalid email format');
//       return;
//     }

//     if (!this.validateMobileNumber()) {
//       alert('Mobile number must be 10 digits');
//       return;
//     }

//     if (!this.isPasswordStrong) {
//       alert("Password must contain at least one uppercase, one lowercase, one number, one special character, and be at least 8 characters long.");
//       return;
//     }

//     if (this.registrationData.Password !== this.confirmPassword) {
//       alert('Passwords do not match');
//       return;
//     }

//     console.log('Registration Data:', this.registrationData);
//     console.log('Role Value:', this.registrationData.UserRole);

//     this.authService.register(this.registrationData).subscribe({
//       next: (response) => {
//         console.log('Registration successful:', response);
//         Swal.fire({
//           title: 'Registration Successful',
//           text: 'You have successfully registered!',
//           icon: 'success',
//           confirmButtonText: 'OK'
//         }).then(() => {
//           this.router.navigate(['/login']);
//         });
//       },
//       error: (err) => {
//         console.error('Registration failed', err);
//         if (err.error && err.error.errors) {
//           console.log('Validation Errors:', err.error.errors);
//           alert(`Registration failed: ${JSON.stringify(err.error.errors)}`);
//         } else {
//           alert('Registration failed. Please check your input and try again.');
//         }
//       }
//     });
//   }
// }

//FOR FINAL PRESENTATION

// import { Component, OnInit } from '@angular/core';
// import { Router } from '@angular/router';
// import { AuthService } from 'src/app/services/auth.service';
// import Swal from 'sweetalert2';
// import { User } from 'src/app/models/user.model';
// import { environment } from 'src/app/environments/environment';

// @Component({
//   selector: 'app-registration',
//   templateUrl: './registration.component.html',
//   styleUrls: ['./registration.component.css']
// })
// export class RegistrationComponent implements OnInit {
//   registrationData: User = {
//     Username: '',
//     Email: '',
//     Password: '',
//     MobileNumber: '',
//     UserRole: ''
//   };
//   confirmPassword: string = '';
//   isPasswordStrong: boolean = false;
//   passwordError = '';
//   isConfirm: boolean = false;
//   error = '';
//   adminSecretKey: string = '';
//   passwordFieldType: string = 'password';
//   confirmPasswordFieldType: string = 'password';
//   captchaToken: string | null = null;

//   constructor(private authService: AuthService, private router: Router) {}

//   ngOnInit(): void {}

//   validatePassword() {
//     const password = this.registrationData.Password;
//     const regex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/;
//     this.isPasswordStrong = regex.test(password);
//     this.passwordError = this.isPasswordStrong
//       ? ''
//       : "Password must contain at least one uppercase, one lowercase, one number, one special character, and be at least 8 characters long.";
//   }

//   passwordMatch() {
//     this.isConfirm = this.registrationData.Password === this.confirmPassword;
//     this.error = this.isConfirm ? '' : "*Passwords do not match";
//   }

//   validateEmail(): boolean {
//     const email = this.registrationData.Email;
//     const emailregex = /^[^\s@]+@gmail\.com$/;
//     return emailregex.test(email);
//   }
//   validateMobileNumber(): boolean {
//         const mobileNumber = this.registrationData.MobileNumber;
//         const mobileregex = /^[6-9]\d{9}$/;
//         return mobileregex.test(mobileNumber);
//   }

//   onCaptchaResolved(token: string): void {
//     this.captchaToken = token;
//     console.log('CAPTCHA Token:', token);
//   }

//   onRegister() {
//     // CAPTCHA check
//     if (!this.captchaToken) {
//       Swal.fire({
//         title: 'CAPTCHA Required',
//         text: 'Please verify you are human.',
//         icon: 'warning',
//         confirmButtonText: 'OK'
//       });
//       return;
//     }

//     // Field validation
//     if (!this.registrationData.Username || 
//         !this.registrationData.Email || 
//         !this.registrationData.Password || 
//         !this.registrationData.MobileNumber || 
//         !this.registrationData.UserRole) {
//       alert("All fields are required.");
//       return;
//     }

//     // Admin key validation
//     if (this.registrationData.UserRole === 'Admin') {
//       if (!this.adminSecretKey) {
//         alert("Admin Key is required for Admin registration.");
//         return;
//       }

//       if (this.adminSecretKey !== environment.adminSecretKey) {
//         Swal.fire({
//           title: 'Access Denied!',
//           text: 'Invalid Admin Key. You are not authorized.',
//           icon: 'error',
//           confirmButtonText: 'OK'
//         });
//         return;
//       }
//     }

//     // Email format validation
//     if (!this.validateEmail()) {
//       alert('Invalid email format. Only Gmail addresses are allowed.');
//       return;
//     }

//     // Mobile number validation
//     if (!this.validateMobileNumber()) {
//       alert('Mobile number must be 10 digits and start with 6-9.');
//       return;
//     }

//     // Password strength validation
//     if (!this.isPasswordStrong) {
//       alert("Password must contain at least one uppercase, one lowercase, one number, one special character, and be at least 8 characters long.");
//       return;
//     }

//     // Password match validation
//     if (this.registrationData.Password !== this.confirmPassword) {
//       alert('Passwords do not match');
//       return;
//     }

//     // Final payload
//     const payload = {
//       ...this.registrationData,
//       adminSecretKey: this.adminSecretKey,
//       captchaToken: this.captchaToken
//     };

//     console.log('Registration Payload:', payload);

//     this.authService.register(payload).subscribe({
//       next: (response) => {
//         console.log('Registration successful:', response);
//         Swal.fire({
//           title: 'Registration Successful',
//           text: 'You have successfully registered!',
//           icon: 'success',
//           confirmButtonText: 'OK'
//         }).then(() => {
//           this.router.navigate(['/login']);
//         });
//       },
//       error: (err) => {
//         console.error('Registration failed', err);
//         if (err.error && err.error.errors) {
//           console.log('Validation Errors:', err.error.errors);
//           alert(`Registration failed: ${JSON.stringify(err.error.errors)}`);
//         } else {
//           alert('Registration failed. Please check your input and try again.');
//         }
//       }
//     });
//   }
// }


//OTP
import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { AuthService } from 'src/app/services/auth.service';
import Swal from 'sweetalert2';
import { User } from 'src/app/models/user.model';
import { environment } from 'src/app/environments/environment';

@Component({
  selector: 'app-registration',
  templateUrl: './registration.component.html',
  styleUrls: ['./registration.component.css']
})
export class RegistrationComponent implements OnInit {
  registrationData: User = {
    Username: '',
    Email: '',
    Password: '',
    MobileNumber: '',
    UserRole: ''
  };
  confirmPassword: string = '';
  isPasswordStrong: boolean = false;
  passwordError = '';
  isConfirm: boolean = false;
  error = '';
  adminSecretKey: string = '';
  passwordFieldType: string = 'password';
  confirmPasswordFieldType: string = 'password';
  captchaToken: string | null = null;

  otp: string = '';
  otpSent: boolean = false;
  submitting: boolean = false;

  constructor(private authService: AuthService, private router: Router) {}

  ngOnInit(): void {}

  validatePassword() {
    const password = this.registrationData.Password;
    const regex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/;
    this.isPasswordStrong = regex.test(password);
    this.passwordError = this.isPasswordStrong
      ? ''
      : "Password must contain at least one uppercase, one lowercase, one number, one special character, and be at least 8 characters long.";
  }

  passwordMatch() {
    this.isConfirm = this.registrationData.Password === this.confirmPassword;
    this.error = this.isConfirm ? '' : "*Passwords do not match";
  }

  validateEmail(): boolean {
    const email = this.registrationData.Email;
        const emailregex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        return emailregex.test(email);
  }

  validateMobileNumber(): boolean {
    const mobileNumber = this.registrationData.MobileNumber;
    const mobileregex = /^[6-9]\d{9}$/;
    return mobileregex.test(mobileNumber);
  }

  onCaptchaResolved(token: string): void {
    this.captchaToken = token;
    console.log('CAPTCHA Token:', token);
  }

  sendOtp(): void {
    const email = this.registrationData.Email;
    if (!email || !this.validateEmail()) {
      Swal.fire('Invalid Email', 'Please enter a valid Gmail address before requesting OTP.', 'warning');
      return;
    }

    this.submitting = true;
    this.authService.sendOtp(email).subscribe({
      next: () => {
        this.submitting = false;
        this.otpSent = true;
        Swal.fire('OTP Sent', 'Please check your email for the OTP.', 'info');
      },
      error: () => {
        this.submitting = false;
        Swal.fire('Error', 'Failed to send OTP. Try again.', 'error');
      }
    });
  }

  onRegister() {
    if (!this.captchaToken) {
      Swal.fire('CAPTCHA Required', 'Please verify you are human.', 'warning');
      return;
    }

    if (!this.registrationData.Username || 
        !this.registrationData.Email || 
        !this.registrationData.Password || 
        !this.registrationData.MobileNumber || 
        !this.registrationData.UserRole) {
      alert("All fields are required.");
      return;
    }

    if (this.registrationData.UserRole === 'Admin') {
      if (!this.adminSecretKey) {
        alert("Admin Key is required for Admin registration.");
        return;
      }

      if (this.adminSecretKey !== environment.adminSecretKey) {
        Swal.fire('Access Denied!', 'Invalid Admin Key. You are not authorized.', 'error');
        return;
      }
    }

    if (!this.validateEmail()) {
      alert('Invalid email format. Only Gmail addresses are allowed.');
      return;
    }

    if (!this.validateMobileNumber()) {
      alert('Mobile number must be 10 digits and start with 6-9.');
      return;
    }

    if (!this.isPasswordStrong) {
      alert("Password must contain at least one uppercase, one lowercase, one number, one special character, and be at least 8 characters long.");
      return;
    }

    if (this.registrationData.Password !== this.confirmPassword) {
      alert('Passwords do not match');
      return;
    }

    if (!this.otpSent || !this.otp) {
      Swal.fire('OTP Required', 'Please enter the OTP sent to your email.', 'warning');
      return;
    }

    const payload = {
      ...this.registrationData,
      adminSecretKey: this.adminSecretKey,
      captchaToken: this.captchaToken
    };

    this.submitting = true;

    this.authService.verifyOtp(this.registrationData.Email, this.otp).subscribe({
      next: () => {
        this.authService.register(payload).subscribe({
          next: () => {
            Swal.fire('Registration Successful', 'You have successfully registered!', 'success')
              .then(() => this.router.navigate(['/login']));
            this.submitting = false;
          },
          error: (err) => {
            console.error('Registration failed', err);
            alert('Registration failed. Please check your input and try again.');
            this.submitting = false;
          }
        });
      },
      error: () => {
        Swal.fire('OTP Verification Failed', 'Invalid OTP. Please try again.', 'error');
        this.submitting = false;
      }
    });
  }
}
