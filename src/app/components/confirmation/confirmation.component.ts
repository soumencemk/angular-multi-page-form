import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { OnboardingService } from '../../services/onboarding.service';

@Component({
  selector: 'app-confirmation',
  templateUrl: './confirmation.component.html',
  styleUrls: ['./confirmation.component.css'],
})
export class ConfirmationComponent implements OnInit {
  data: any;

  constructor(
    private onboardingService: OnboardingService,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.onboardingService.getOnboardingData().subscribe((data) => {
      this.data = data;
    });
  }

  confirmAndSubmit() {
    this.onboardingService.submitOnboarding().subscribe({
      next: () => {
        this.onboardingService.resetOnboardingData();
        this.router.navigate(['/completion']);
      },
      error: (err) => {
        console.error('Onboarding submission failed:', err);
        // Optionally, display an error message to the user
      },
    });
  }

  edit() {
    this.router.navigate(['/step-one']);
  }
}
