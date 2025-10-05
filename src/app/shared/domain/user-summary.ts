export interface UserSummary {
  id: string | number;
  email: string;
  fullName: string;
  role?: 'Vehicle Owner' | 'Auto Repair Workshop';
}
