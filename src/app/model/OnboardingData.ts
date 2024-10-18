export interface OnboardingData {
  personalInfo?: {
    firstName: string;
    lastName: string;
    email: string;
    phone: string;
  };
  accountSetup?: {
    username: string;
    password: string;
  };
  preferences?: {
    emailNotifications: boolean;
    smsNotifications: boolean;
    pushNotifications: boolean;
    theme: string;
    language: string;
  };
  additionalInfo?: {
    bio: string;
    linkedin: string;
  };
}