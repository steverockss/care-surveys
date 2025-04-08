// src/app/survey-wizard/survey-wizard.component.ts
import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
// src/app/survey-wizard/survey-wizard.constants.ts
export const COMMON_OPTIONS = ['', 'Siempre', 'Casi siempre', 'Casi nunca', 'Nunca'];
import { Firestore, collection, addDoc } from '@angular/fire/firestore'
import { Question, QuestionService } from '../services/questions.service';

interface SurveySection {
  title: string;
  questions: any[];
}

@Component({
  selector: 'app-survey-wizard',
  standalone: true,
  imports: [ReactiveFormsModule, CommonModule],
  templateUrl: './survey-wizard.component.html',
  styleUrls: ['./survey-wizard.component.css']
})
export class SurveyWizardComponent implements OnInit {
  surveyForm: FormGroup;
  currentStep: number = 0;
  questions: Question[] = [];


  // Definición de secciones: la primera es la parte demográfica y luego van las secciones de preguntas.
  surveySections: SurveySection[] = [
    {
      title: 'Información Demográfica',
      questions: [
        { label: 'Nombre completo', controlName: 'fullName', type: 'text', placeholder: 'Ingresa tu nombre completo' },
        { label: 'Edad', controlName: 'age', type: 'number', placeholder: 'Ingresa tu edad' },
        { label: 'Tipo de documento', controlName: 'documentType', type: 'text', placeholder: 'Ej. Cédula, Pasaporte' },
        { label: 'Número de documento', controlName: 'documentNumber', type: 'text', placeholder: 'Ingresa tu número de documento' },
        { label: 'Nacionalidad', controlName: 'nationality', type: 'text', placeholder: 'Ingresa tu nacionalidad' },
        { label: 'Localidad', controlName: 'locality', type: 'text', placeholder: 'Ingresa tu localidad' },
        {
          label: 'Nivel educativo',
          controlName: 'educationLevel',
          type: 'select',
          options: ['', 'Preescolar', 'Primaria', 'Bachillerato', 'Universidad']
        },
        {
          label: 'Género',
          controlName: 'gender',
          type: 'select',
          options: ['', 'Masculino', 'Femenino', 'Otro']
        }
      ]
    },
   
  ];

  constructor(private fb: FormBuilder, private questionService: QuestionService) {
    this.surveyForm = this.fb.group({});
  }

  ngOnInit(): void {
    // Se crean los controles del formulario para cada pregunta de cada sección.
    this.surveySections.forEach(section => {
      section.questions.forEach(question => {
        // Definimos un valor predeterminado según el tipo; aquí se usa '' para la mayoría.
        let defaultValue: any = '';
        // Puedes agregar validadores específicos por control si es necesario.
        this.surveyForm.addControl(question.controlName, this.fb.control(defaultValue, Validators.required));

        this.questionService.getQuestions().subscribe(data => {
          this.questions = data;
          console.log(this.questions);
        });
      });
    });
  }

  nextStep() {
    if (this.currentStep < this.surveySections.length - 1) {
      this.currentStep++;
    } else {
      // Último paso: aquí se envía el formulario.
      console.log('Enviando respuestas:', this.surveyForm.value);
      // Implementa la lógica para enviar a Firebase o tu backend.
    }
  }

  isCurrentSectionValid(): boolean {
    let valid = true;
    this.surveySections[this.currentStep].questions.forEach(question => {
      if (this.surveyForm.get(question.controlName)?.invalid) {
        valid = false;
      }
    });
    return valid;
  }

  previousStep() {
    if (this.currentStep > 0) {
      this.currentStep--;
    }
  }
}
