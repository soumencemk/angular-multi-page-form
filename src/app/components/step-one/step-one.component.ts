import { Component } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { OnboardingService } from 'src/app/services/onboarding.service';

@Component({
  selector: 'app-step-one',
  templateUrl: './step-one.component.html',
  styleUrls: ['./step-one.component.css'],
})
export class StepOneComponent {
  stepOneForm!: FormGroup;
  constructor(
    private fb: FormBuilder,
    private onboardingService: OnboardingService,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.stepOneForm = this.fb.group({
      firstName: ['', Validators.required],
      lastName: ['', Validators.required],
      email: ['', [Validators.required, Validators.email]],
      phone: ['', Validators.required]
    });

    this.onboardingService.getOnboardingData().subscribe(data => {
      if (data && data.personalInfo) {
        this.stepOneForm.patchValue(data.personalInfo);
      }
    });
  }
 
  saveAndContinue() {
    if (this.stepOneForm.valid) {
      this.onboardingService.setPersonalInfo(this.stepOneForm.value);
      this.router.navigate(['/step-two']);
    }
  }
}