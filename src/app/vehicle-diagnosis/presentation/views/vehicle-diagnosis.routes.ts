import {Routes} from '@angular/router';

const diagnosisView = () => import('./diagnosis-view/diagnosis-view').then(m => m.DiagnosisView);
const modifyDiagnosis = () => import('./modify-diagnosis/modify-diagnosis').then(m => m.ModifyDiagnosis);

export const VehicleDiagnosisRoutes: Routes = [
  { path: 'diagnosis-view', loadComponent: diagnosisView },
  { path: 'modify-diagnosis/:id', loadComponent: modifyDiagnosis, data:{renderMode:'client'} }
];
