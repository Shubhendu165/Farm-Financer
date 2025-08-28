import { ChangeDetectorRef, Component, Injectable, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { LoanService } from 'src/app/services/loan.service';
import { LoanApplication } from 'src/app/models/loanapplication.model';
import { HttpClient } from '@angular/common/http';
import { AuthService } from 'src/app/services/auth.service';
import { HttpHeaders } from '@angular/common/http';
import { UsernavComponent } from '../usernav/usernav.component';
import { ReactiveFormsModule } from '@angular/forms';
import { environment } from 'src/app/environments/environment';

@Injectable({
  providedIn: 'root'
})


@Component({
  selector: 'app-loanform',
  templateUrl: './loanform.component.html',
  styleUrls: ['./loanform.component.css']
})
export class LoanformComponent implements OnInit {
  loanForm!: FormGroup;
  showSuccessPopup = false;
  errorMessage: string = '';
  loanData: LoanApplication;

  constructor(
    private fb: FormBuilder,
    private loanService: LoanService,
    private route: ActivatedRoute,
    private router: Router,
    private http: HttpClient,
    private authService: AuthService,
    private cdr: ChangeDetectorRef
  ) {
    this.loanData = {
      loanApplicationId: 0,
      userId: 0,
      loanId: 0,
      submissionDate: '',
      farmLocation: '',
      farmerAddress: '',
      farmSizeInAcres: 0,
      farmPurpose: '',
      file: ''
    };
  }

  ngOnInit(): void {
    this.route.params.subscribe(params => {
      this.loanData.loanId = +params['loanId'];
    });

    const userId = localStorage.getItem('userId');
    this.loanData.userId = userId ? Number(userId) : 0;

    const now = new Date();
    this.loanData.submissionDate = now.toISOString();

    this.loanForm = this.fb.group({
      farmLocation: ['', Validators.required],
      farmerAddress: ['', Validators.required],
      farmSizeInAcres: [0, Validators.required],
      farmPurpose: ['', Validators.required],
      file: ['']
    });
  }
  selectedFile: File | null = null;

  public apiUrl= environment.apiUrl;
  fileError: string = '';

  async onSubmit() {
    const imageUrl = await this.uploadImage();
    this.loanData.file=imageUrl;
    if (this.loanForm.invalid) return;

    const formValues = this.loanForm.value;
    this.loanData = { ...this.loanData, ...formValues };

    console.log('Loan Data:', this.loanData);

    this.loanService.addLoanApplication(this.loanData).subscribe({
      next: () => {
        console.log('Loan application submitted successfully');
        this.showSuccessPopup = true;
        this.errorMessage = '';
      },
      error: (error) => {
        console.error('Submission failed', error);
        this.errorMessage = error.error.message || 'Failed to submit the loan application. Please try again.';
      }
    });
  }

  onFileChange(event: any): void {
    const file = event.target.files[0];
    if (file) {
      const fileType = file.type.toLowerCase();
      if (fileType === 'image/jpeg' || fileType === 'image/png' || fileType === 'image/jpg') {
        this.selectedFile = file;
        this.fileError = ''; // Clear any previous error
      } else {
        this.fileError = 'Only .jpg, .jpeg, and .png files are allowed.';
        this.selectedFile = null; // Clear the selected file
        (event.target as HTMLInputElement).value = ''; // Clear the input value
      }
    } else {
      this.fileError = 'Proof Document is required.';
    }
  }

  uploadImage(): Promise<string | null> {
    return new Promise((resolve, reject) => {
      if (this.selectedFile) {
        const formData = new FormData();
        formData.append('file', this.selectedFile, this.selectedFile.name);
        const httpOptions = {
          headers: new HttpHeaders({
            'Authorization': 'Bearer ' + localStorage.getItem('Token')
          })
        };

        this.http.post<{ ImageUrl: string }>(`${this.apiUrl}/api/loan-application/application/upload`, formData, httpOptions)
          .subscribe(
            response => resolve(response.ImageUrl),
            error => {
              console.error('Error uploading image:', error);
              this.fileError = 'Error uploading image.';
              reject(error);
            }
          );
      } else {
        this.fileError = 'No file selected.';
        resolve(null);
      }
    });
  }


  closePopup(): void {
    this.showSuccessPopup = false;
    this.router.navigate(['/userviewloan']);
  }

  goBack(): void {
    this.router.navigate(['/userviewloan']);
  }
}
