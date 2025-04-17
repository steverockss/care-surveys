import { bootstrapApplication } from '@angular/platform-browser';
import { provideRouter } from '@angular/router';
import { AppComponent } from './app/app.component';
import { routes } from './app/app.routes';
import { provideFirebaseApp, initializeApp } from '@angular/fire/app';
import { provideFirestore, getFirestore } from '@angular/fire/firestore';
import { NgxEchartsModule }            from 'ngx-echarts';
import * as echarts                    from 'echarts';
import { environment } from './environments/environment';
import { importProvidersFrom } from '@angular/core';

bootstrapApplication(AppComponent, {
  providers: 
  [provideFirebaseApp(() => initializeApp(environment.firebase)),
  provideFirestore(() => getFirestore()), provideRouter(routes),
  importProvidersFrom(
    NgxEchartsModule.forRoot({ echarts })
  )]
}).catch(err => console.error(err));