import { Component, OnInit } from '@angular/core';
import { SurveyService } from '../services/surveys.service';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import Swal from 'sweetalert2';

interface StudentSurvey {
  documentNumber: string;
  fullName: string;
  initialSurveyId?: string;
  secondarySurveyId?: string;
}

@Component({
  selector: 'app-survey-admin',
  imports: [CommonModule],
  standalone: true,
  templateUrl: './survey-admin.component.html',
  styleUrl: './survey-admin.component.css'
})


export class SurveyAdminComponent implements OnInit {
  studentSurveys: StudentSurvey[] = [];
  loading: boolean = true;
  searchTerm: string = '';

  pageNumber: number = 1;
  pageSize: number = 10;

  constructor(private surveyService: SurveyService, private router: Router) {}


  async ngOnInit(): Promise<void> {
    try {
      const surveys = await this.surveyService.getSurveys();
      console.log(surveys);
      this.processSurveys(surveys);
    } catch (error) {
      console.error('Error al cargar las encuestas:', error);
    } finally {
      this.loading = false;
    }
  }

  private processSurveys(surveys: any[]): void {
    // Agrupamos las encuestas por documentNumber (ID del estudiante)
    const groups: { [docNumber: string]: StudentSurvey } = {};

    surveys.forEach(survey => {
      const docNum = survey.documentNumber || 'SIN_ID';
      if (!groups[docNum]) {
        groups[docNum] = {
          documentNumber: docNum,
          fullName: survey.fullName || '',
        };
      }
      // Asumimos que survey.surveyType puede ser 'inicial' o 'secundaria'
      if (survey.surveyType === 'inicial') {
        groups[docNum].initialSurveyId = survey.id;
      } else if (survey.surveyType === 'secundaria') {
        groups[docNum].secondarySurveyId = survey.id;
      }
    });

    

    // Convertimos el objeto de grupos en un arreglo para iterar en el template
    this.studentSurveys = Object.values(groups);
  }

  editSurvey(surveyId: string) {
    this.router.navigate(['/survey-edit', surveyId]);
  }

  async deleteSurvey(surveyId: string) {
    const result = await Swal.fire({
      title: '¿Eliminar?',
      text: '¿Está seguro de eliminar esta encuesta?',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonText: 'Sí, eliminar',
      cancelButtonText: 'Cancelar'
    });

    if (result.isConfirmed) {
      try {
        await this.surveyService.deleteSurvey(surveyId);
        Swal.fire('Eliminada', 'La encuesta ha sido eliminada.', 'success');
        // Recargamos la lista de encuestas
        this.ngOnInit();
      } catch (error) {
        Swal.fire('Error', 'No se pudo eliminar la encuesta.', 'error');
      }
    }
  }

}
