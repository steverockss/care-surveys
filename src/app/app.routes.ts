// src/app/app.routes.ts
import { Routes } from '@angular/router';
import { SurveyWizardComponent } from './survey-wizard/survey-wizard.component';

export const routes: Routes = [
  { path: 'encuesta', component: SurveyWizardComponent },
  { path: '**', redirectTo: '' }
];
