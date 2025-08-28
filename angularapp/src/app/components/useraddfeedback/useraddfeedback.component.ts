import { Component, OnInit } from '@angular/core';
import { NgForm } from '@angular/forms';
import { Router } from '@angular/router';
import { Feedback } from 'src/app/models/feedback.model';
//import { User } from 'src/app/models/user.model';
import { FeedbackService } from 'src/app/services/feedback.service';
import Swal from 'sweetalert2'; // Import SweetAlert2

@Component({
  selector: 'app-useraddfeedback',
  templateUrl: './useraddfeedback.component.html',
  styleUrls: ['./useraddfeedback.component.css']
})
export class UseraddfeedbackComponent implements OnInit {
  feedback: Feedback = {
    UserId: 0,
    FeedbackText: '',
    Date: new Date()
  };
  isSubmitted:boolean=false;
  submitting:boolean=false;

  constructor(private feedbackService: FeedbackService, private router: Router) {}
  ngOnInit(): void {}

  onSubmit() {
   
    if (this.feedback) {
     
      this.feedback.UserId = parseInt(localStorage.getItem('userId'), 10);
      this.feedback.Date = new Date();
      this.submitting=true;
      console.log('Submitting feedback:', this.feedback);
      this.feedbackService.sendFeedback(this.feedback).subscribe({
        next: (res) => {
          console.log("Added successfully", res);
          this.isSubmitted = true;
          this.submitting=false;
          Swal.fire({
            title: 'Feedback Submitted',
            text: 'Your feedback has been successfully submitted!',
            icon: 'success',
            confirmButtonText: 'OK'
          }).then(() => {
            this.router.navigate(['/userviewfeedback']);
          });
        },
        error: (err) => {
          console.error('Error submitting feedback:', err);
          this.submitting=false;
          Swal.fire({
            title: 'Submission Failed',
            text: 'There was an error submitting your feedback.',
            icon: 'error',
            confirmButtonText: 'OK'
          });
          this.submitting = false;
        }
      });
      
    } else {
      console.log('Please enter your feedback');
    }
  }

  closePopup() {
    this.isSubmitted = false;
  }
}



