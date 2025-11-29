import {Routes} from '@angular/router';

const diagnosisView = () => import('./diagnosis-view/diagnosis-view').then(m => m.DiagnosisView);
const modifyDiagnosis = () => import('./modify-diagnosis/modify-diagnosis').then(m => m.ModifyDiagnosis);
const checkDiagnostics = () => import('./check-diagnostics/check-diagnostics').then(m => m.CheckDiagnostics);

export const VehicleDiagnosisRoutes: Routes = [
  { path: 'diagnosis-view', loadComponent: diagnosisView },
  { path: 'check-diagnostics/:id', loadComponent: checkDiagnostics },
  { path: 'modify-diagnosis/edit/:id', loadComponent: modifyDiagnosis },
];
