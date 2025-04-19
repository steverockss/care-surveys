// src/app/app.routes.ts
import { Routes } from '@angular/router';
import { SurveyWizardComponent } from './components/survey-wizard/survey-wizard.component';
import { SurveyAdminComponent } from './components/survey-admin/survey-admin.component';
import { LinearChartComponent } from './components/charts/linear-chart/linear-chart.component'
import { GroupedBarChartComponent } from './components/charts/grouped-bar-chart/grouped-bar-chart.component'
import { StackedBarChartComponent } from './components/charts/stacked-bar-chart/stacked-bar-chart.component'
import { HeatMapComponent } from './components/charts/heat-map/heat-map.component'
export const routes: Routes = [
  { path: 'encuesta', component: SurveyWizardComponent },
  { path: 'administrar-encuestas', component: SurveyAdminComponent },
  { path: 'graficas/linear', component: LinearChartComponent },
  { path: 'graficas/columnas', component: GroupedBarChartComponent },
  { path: 'graficas/areas-apiladas', component: StackedBarChartComponent },
  { path: 'graficas/mapa-calor', component: HeatMapComponent },
  { path: '**', redirectTo: 'encuesta' }
];
