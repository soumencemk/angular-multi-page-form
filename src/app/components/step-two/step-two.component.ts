import { Component, OnInit } from '@angular/core';
import {
  FormBuilder,
  Validators,
  FormGroup,
  ValidationErrors,
} from '@angular/forms';
import { Router } from '@angular/router';
import { OnboardingService } from '../../services/onboarding.service';

@Component({
  selector: 'app-step-two',
  templateUrl: './step-two.component.html',
  styleUrls: ['./step-two.component.css'],
})
export class StepTwoComponent implements OnInit {
  stepTwoForm!: FormGroup;
  passwordStrength: {
    label: string;
    percentage: number;
    class: string;
    color: string;
  } | null = null;
  hidePassword: boolean = true;
  hideConfirmPassword: boolean = true;

  constructor(
    private fb: FormBuilder,
    private onboardingService: OnboardingService,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.stepTwoForm = this.fb.group(
      {
        username: ['', Validators.required],
        password: [
          '',
          [
            Validators.required,
            Validators.minLength(8),
            Validators.pattern(
              /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?#&])[A-Za-z\d@$!%*?#&]{8,}$/
            ),
          ],
        ],
        confirmPassword: ['', Validators.required],
      },
      { validators: this.passwordMatchValidator }
    );

    this.onboardingService.getOnboardingData().subscribe((data) => {
      if (data && data.accountSetup) {
        this.stepTwoForm.patchValue({
          username: data.accountSetup.username,
          password: data.accountSetup.password,
          confirmPassword: data.accountSetup.password,
        });
      }
    });

    this.stepTwoForm.get('password')?.valueChanges.subscribe((value) => {
      this.evaluatePasswordStrength(value);
      this.stepTwoForm.get('confirmPassword')?.updateValueAndValidity();
    });

    this.stepTwoForm.get('confirmPassword')?.valueChanges.subscribe(() => {
      this.stepTwoForm.updateValueAndValidity();
    });
  }

  passwordMatchValidator(form: FormGroup): ValidationErrors | null {
    const passwordControl = form.get('password');
    const confirmPasswordControl = form.get('confirmPassword');

    if (!passwordControl || !confirmPasswordControl) {
      return null;
    }

    const password = passwordControl.value;
    const confirmPassword = confirmPasswordControl.value;

    if (password === confirmPassword) {
      // If passwords match, remove the error from confirmPassword
      if (confirmPasswordControl.hasError('passwordMismatch')) {
        confirmPasswordControl.setErrors(null);
      }
      return null;
    } else {
      // If passwords do not match, set the error on confirmPassword
      confirmPasswordControl.setErrors({ passwordMismatch: true });
      return { passwordMismatch: true };
    }
  }

  saveAndContinue() {
    this.stepTwoForm.markAllAsTouched();
    if (this.stepTwoForm.invalid) {
      return;
    }
    const { username, password } = this.stepTwoForm.value;
    this.onboardingService.setAccountSetup({ username, password });
    this.router.navigate(['/step-three']);
  }

  evaluatePasswordStrength(password: string) {
    let strength = 0;
    if (password.length >= 8) strength += 1;
    if (/[A-Z]/.test(password)) strength += 1;
    if (/[a-z]/.test(password)) strength += 1;
    if (/\d/.test(password)) strength += 1;
    if (/[@$!%*?#&]/.test(password)) strength += 1;

    switch (strength) {
      case 5:
        this.passwordStrength = {
          label: 'Strong',
          percentage: 100,
          class: 'strong',
          color: 'accent',
        };
        break;
      case 3:
      case 4:
        this.passwordStrength = {
          label: 'Medium',
          percentage: 60,
          class: 'medium',
          color: 'warn',
        };
        break;
      default:
        this.passwordStrength = {
          label: 'Weak',
          percentage: 30,
          class: 'weak',
          color: 'warn',
        };
    }
  }
}
