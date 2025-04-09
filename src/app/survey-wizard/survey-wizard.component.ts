// src/app/survey-wizard/survey-wizard.component.ts
import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
// src/app/survey-wizard/survey-wizard.constants.ts
export const COMMON_OPTIONS = ['', 'Siempre', 'Casi siempre', 'Casi nunca', 'Nunca'];
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

   COMMON_OPTIONS = []

  // Definición de secciones: la primera es la parte demográfica y luego van las secciones de preguntas.
  surveySections: SurveySection[] = [
    {
      title: 'Aviso para el Tratamiento de Datos Personales',
      questions: [
        {
          // Tipo personalizado 'info' para mostrar el texto legal
          type: 'info',
          label: `
            La información suministrada por usted se mantendrá bajo estricta
            confidencialidad y no se utilizará su nombre u otra información
            de identificación personal suya. Los datos se manejarán de manera
            codificada, para disminuir cualquier riesgo de vulneración de la
            confidencialidad.

            AVISO PARA EL TRATAMIENTO DE DATOS PERSONALES

            Los investigadores en cumplimiento de la Ley 1581 de 2012 y del
            Decreto Nacional 1377 de 2013 y demás disposiciones vigentes que
            regulan la materia, en calidad de responsables del tratamiento
            de los datos personales alojados en sus bases de datos o archivos
            (almacenamiento, uso, circulación o eliminación), realizan la
            siguiente indicación:

            En la condición señalada, se requiere su autorización previa,
            expresa y que, de manera libre, voluntaria y debidamente informada,
            nos permita almacenar, usar, archivar, suprimir o consultar sus
            datos en general, dar tratamiento a los datos que fueron
            suministrados en el entendido que solo serán empleados para las
            finalidades aquí indicadas y que van con los objetivos propuestos,
            acorde con la normatividad vigente sobre el particular.
          `
        },
        {
          type: 'checkbox',
          label: 'Acepto el Tratamiento de Datos Personales',
          controlName: 'acceptDataPolicy'
        }
      ]
    },
    {
      title: 'Información Demográfica',
      questions: [
        { label: 'Nombre completo', controlName: 'fullName', type: 'text', placeholder: 'Ingresa tu nombre completo' },
        { label: 'Edad', controlName: 'age', type: 'number', placeholder: 'Ingresa tu edad' },
        {
          label: 'Tipo de documento',
          type: 'select',
          controlName: 'documentType',
          options: [
            '',
            'Cédula de ciudadanía',
            'Tarjeta de identidad',
            'Cédula de extranjería',
            'Pasaporte'
          ]
        },
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
        },
        {
          label: 'Año que ingreso al programa',
          type: 'select',
          controlName: 'programYear',
          options: [
            '',
            '2023',
            '2024',
            '2025'
          ]
        }
      ]
    },
    // Aquí puedes agregar las demás secciones según lo requieras.
  ];

  constructor(private fb: FormBuilder, private questionService: QuestionService) {
    this.surveyForm = this.fb.group({});
  }

  
  ngOnInit(): void {
    // Crear controles del formulario para cada pregunta de cada sección.
    this.surveySections.forEach(section => {
      section.questions.forEach(question => {
        let defaultValue: any = '';
        this.surveyForm.addControl(question.controlName, this.fb.control(defaultValue, Validators.required));
      });
    });

    // Llamada única al service para obtener las preguntas desde Firestore.
    this.questionService.getQuestions().subscribe(data => {
      this.questions = data;
      console.log('Preguntas obtenidas:', this.questions);


      const transformedQuestions = data.sort((a, b) => Number(a.code) - Number(b.code))
        .map(q => ({
          label: `${q.code}. ${q.text}`,
        
          controlName:  'q' + q.code,
          number: q.code,
          type: 'select',
          options: COMMON_OPTIONS
        }));

      const dynamicSections: SurveySection[] = [
        { title: 'Evaluación Personal  Parte 1', questions: transformedQuestions.filter(q => Number(q.number) >= 1 && Number(q.number) <= 10) },
        { title: 'Evaluación Personal  Parte 2', questions: transformedQuestions.filter(q => Number(q.number) >= 11 && Number(q.number) <= 20) },
        { title: 'Evaluación Personal  Parte 3', questions: transformedQuestions.filter(q => Number(q.number) >= 21 && Number(q.number) <= 30) },
        { title: 'Evaluación Personal  Parte 4', questions: transformedQuestions.filter(q => Number(q.number) >= 31 && Number(q.number) <= 40) },
        { title: 'Evaluación Personal  Parte 5', questions: transformedQuestions.filter(q => Number(q.number) >= 41 && Number(q.number) <= 50) },
      ];
      const dynamicSection = { title: 'Evaluación Personal', questions: transformedQuestions };
      this.surveySections = this.surveySections.concat(dynamicSections);

      dynamicSection.questions.forEach(question => {
        this.surveyForm.addControl(question.controlName, this.fb.control('', Validators.required));
      });

      this.surveyForm.addControl('age', this.fb.control(null, [Validators.required, Validators.min(1), Validators.max(99)]));

      console.log(this.surveySections)
    });
  }

  validateAge(): void {
    const control = this.surveyForm.get('age');
    if (control) {
      // Convertir el valor a número
      let value = Number(control.value);
      // Verificar que sea un número válido
      if (isNaN(value)) {
        return;
      }
      // Ajustar el valor si está fuera del rango permitido
      if (value < 1) {
        control.setValue(1);
      } else if (value > 99) {
        control.setValue(99);
      }
    }
  }

  convertToUppercase(controlName: string): void {
    const control = this.surveyForm.get(controlName);
    if (control && typeof control.value === 'string') {
      control.setValue(control.value.toUpperCase());
    }
  }
  nextStep() {
    if (this.currentStep < this.surveySections.length - 1) {
      this.currentStep++;
    } else {
      // Último paso: aquí se envía el formulario.
      const trimmedValues: { [key: string]: any } = {}; 
      Object.keys(this.surveyForm.value).forEach(key => {
        const value = this.surveyForm.value[key];
        trimmedValues[key] = (typeof value === 'string') ? value.trim() : value;
      });
      console.log('Enviando respuestas:', this.surveyForm.value, trimmedValues);
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
