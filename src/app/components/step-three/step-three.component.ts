import { Component, OnInit } from '@angular/core';
import {
  FormBuilder,
  ReactiveFormsModule,
  Validators,
  FormGroup,
} from '@angular/forms';
import { Router } from '@angular/router';
import { OnboardingService } from '../../services/onboarding.service';
import { CommonModule } from '@angular/common';


@Component({
  selector: 'app-step-three',
  templateUrl: './step-three.component.html',
  styleUrls: ['./step-three.component.css'],
})
export class StepThreeComponent implements OnInit {
  stepThreeForm!: FormGroup;
  notificationError: boolean = false;

  constructor(
    private fb: FormBuilder,
    private onboardingService: OnboardingService,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.stepThreeForm = this.fb.group({
      emailNotifications: [false],
      smsNotifications: [false],
      pushNotifications: [false],
      theme: ['', Validators.required],
      language: ['', Validators.required],
    });

    this.onboardingService.getOnboardingData().subscribe((data) => {
      if (data && data.preferences) {
        this.stepThreeForm.patchValue(data.preferences);
      }
    });

    this.stepThreeForm.valueChanges.subscribe((formValue) => {
      const { emailNotifications, smsNotifications, pushNotifications } =
        formValue;
      if (
        this.notificationError &&
        (emailNotifications || smsNotifications || pushNotifications)
      ) {
        this.notificationError = false;
      }
    });
  }

  saveAndContinue() {
    this.notificationError = false;
    const { emailNotifications, smsNotifications, pushNotifications } =
      this.stepThreeForm.value;

    if (!emailNotifications && !smsNotifications && !pushNotifications) {
      this.notificationError = true;
      return;
    }

    this.onboardingService.setPreferences(this.stepThreeForm.value);
    this.router.navigate(['/step-four']);
  }
}
