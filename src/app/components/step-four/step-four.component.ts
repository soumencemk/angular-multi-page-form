import { Component, OnInit } from '@angular/core';
import { FormBuilder, Validators, FormGroup } from '@angular/forms';
import { Router } from '@angular/router';
import { OnboardingService } from '../../services/onboarding.service';

@Component({
  selector: 'app-step-four',
  templateUrl: './step-four.component.html',
  styleUrls: ['./step-four.component.css'],
})
export class StepFourComponent implements OnInit {
  stepFourForm!: FormGroup;

  constructor(
    private fb: FormBuilder,
    private onboardingService: OnboardingService,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.stepFourForm = this.fb.group({
      bio: [''],
      linkedin: [
        '',
        Validators.pattern(
          '(https?://)?([\\da-z.-]+)\\.([a-z.]{2,6})([/\\w .-]*)*/?'
        ),
      ],
    });

    // Fetch additional info from onboarding data
    this.onboardingService.getOnboardingData().subscribe((data) => {
      if (data && data.additionalInfo) {
        this.stepFourForm.patchValue(data.additionalInfo);
      }
    });
  }

  saveAndContinue() {
    if (this.stepFourForm.valid) {
      this.onboardingService.setAdditionalInfo(this.stepFourForm.value);
      this.router.navigate(['/confirmation']);
    }
  }

  skip() {
    this.router.navigate(['/confirmation']);
  }
}
