// src/app/app.routes.ts
import { Routes } from '@angular/router';
import { SurveyWizardComponent } from './components/survey-wizard/survey-wizard.component';
import { SurveyAdminComponent } from './components/survey-admin/survey-admin.component';
import { LinearChartComponent } from './components/linear-chart/linear-chart.component'
import { GroupedBarChartComponent } from './components/grouped-bar-chart/grouped-bar-chart.component'
export const routes: Routes = [
  { path: 'encuesta', component: SurveyWizardComponent },
  { path: 'administrar-encuestas', component: SurveyAdminComponent },
  { path: 'graficas/linear', component: LinearChartComponent },
  { path: 'graficas/columnas', component: GroupedBarChartComponent },
  { path: '**', redirectTo: 'encuesta' }
];
