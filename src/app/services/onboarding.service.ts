import { Injectable } from '@angular/core';
import { delay, Observable, of } from 'rxjs';
import { OnboardingData } from '../model/OnboardingData';

@Injectable({
  providedIn: 'root',
})
export class OnboardingService {
  private onboardingData: OnboardingData = {};

  constructor() {}

  setPersonalInfo(data: any): void {
    this.onboardingData.personalInfo = data;
  }

  setAccountSetup(data: any): void {
    this.onboardingData.accountSetup = data;
  }

  setPreferences(data: any): void {
    this.onboardingData.preferences = data;
  }

  setAdditionalInfo(data: any): void {
    this.onboardingData.additionalInfo = data;
  }
  getOnboardingData(): Observable<OnboardingData> {
    return of(this.onboardingData).pipe(delay(500));
  }
  submitOnboarding(): Observable<void> {
    console.log('Submitting Onboarding Data:', this.onboardingData);
    return of(void 0).pipe(delay(1000));
  }
  resetOnboardingData(): void {
    this.onboardingData = {};
  }
}
