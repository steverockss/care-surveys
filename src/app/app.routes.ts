// src/app/app.routes.ts
import { Routes } from '@angular/router';
import { SurveyWizardComponent } from './survey-wizard/survey-wizard.component';
import { SurveyAdminComponent } from './survey-admin/survey-admin.component';
export const routes: Routes = [
  { path: 'encuesta', component: SurveyWizardComponent },
  { path: 'administrar-encuestas', component: SurveyAdminComponent },
  { path: '**', redirectTo: '' }
];
