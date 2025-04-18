// src/app/survey-wizard/survey-wizard.component.ts
import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import Swal from 'sweetalert2';
// src/app/survey-wizard/survey-wizard.constants.ts

export const COMMON_OPTIONS = [{ text: 'Selecciona una opción', value: '' }, { text: 'Totalmente en desacuerdo', value: 1 },
{ text: 'Desacuerdo', value: 2 },
{ text: 'Indiferente', value: 3 },
{ text: 'De acuerdo', value: 4 },
{ text: 'Totalmente de acuerdo', value: 5 }];
import { Question, QuestionService } from '../../services/questions.service';
import { SurveyService } from '../../services/surveys.service';

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
  extraQuestionsAdded: boolean = false;


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
      title: 'Información demográfica',
      questions: [
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
        {
          label: 'Tipo de encuesta',
          type: 'select',
          controlName: 'surveyType',
          options: [
            '',
            'Inicial',
            'Final'
          ]
        }
      ]
    },
    // Aquí puedes agregar las demás secciones según lo requieras.
  ];

  constructor(private fb: FormBuilder, private questionService: QuestionService, private surveyService: SurveyService) {
    this.surveyForm = this.fb.group({});
  }


  ngOnInit(): void {
    // Crear controles del formulario para cada pregunta de cada sección.
    this.surveySections.forEach(section => {
      section.questions.forEach(question => {
        if (question.controlName) {
          let defaultValue: any = '';
          this.surveyForm.addControl(question.controlName, this.fb.control(defaultValue, Validators.required));
        }

      });
    });

    // Llamada única al service para obtener las preguntas desde Firestore.
    this.questionService.getQuestions().subscribe(data => {
      this.questions = data;

      const transformedQuestions = data.sort((a, b) => Number(a.code) - Number(b.code))
        .map(q => ({
          label: `${q.code}. ${q.text}`,

          controlName: 'q' + q.code,
          number: q.code,
          type: 'question_select',
          options: COMMON_OPTIONS,
        }));
        const sectionSize = 5; // 5 preguntas por sección
        const totalQuestions = transformedQuestions.length;
        const totalSections = Math.ceil(totalQuestions / sectionSize);
        
        const dynamicSections = [];
        for (let i = 0; i < totalSections; i++) {
          dynamicSections.push({
            title: '',
            questions: transformedQuestions.slice(i * sectionSize, (i + 1) * sectionSize)
          });
        }
      const dynamicSection = { title: 'Evaluación Personal', questions: transformedQuestions };
      this.surveySections = this.surveySections.concat(dynamicSections);
      dynamicSection.questions.forEach(question => {
        this.surveyForm.addControl(question.controlName, this.fb.control('', Validators.required));
      });
      const extraQuestions = [{ label: 'Nombre completo', controlName: 'fullName', type: 'text', placeholder: 'Ingresa tu nombre completo' },
      { label: 'Edad', controlName: 'age', type: 'number', placeholder: 'Ingresa tu edad' },
      {
        label: 'Género',
        controlName: 'gender',
        type: 'select',
        options: ['', 'Masculino', 'Femenino', 'Otro']
      },
      { label: 'Nacionalidad', controlName: 'nationality', type: 'text', placeholder: 'Ingresa tu nacionalidad' },
      { label: 'Ciudad', controlName: 'city', type: 'text', placeholder: 'Ingresa tu ciudad' },
      { label: 'Localidad', controlName: 'locality', type: 'text', placeholder: 'Ingresa tu localidad' },
      { label: 'Institución educativa - Colegio', controlName: 'school', type: 'text', placeholder: 'Ingresa el nombre de tu colegio' },
      {
        label: 'Nivel educativo',
        controlName: 'educationLevel',
        type: 'select',
        options: ['', 'Preescolar', 'Primaria', 'Bachillerato', 'Universidad']
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
      extraQuestions.forEach(question => {
        if (question.controlName == 'nationality' || question.controlName == 'city' || question.controlName == 'school' || question.controlName == 'school') {
          this.surveyForm.addControl(question.controlName, this.fb.control('', [Validators.required, Validators.pattern(/^[A-Za-zÁÉÍÓÚáéíóúÑñ\s]+$/)]));
        } else {

          this.surveyForm.addControl(question.controlName, this.fb.control('', Validators.required));
        }
      });

      this.surveyForm.valueChanges.subscribe((formValues) => {
        if (formValues["documentType"] && formValues["documentNumber"] && formValues["surveyType"].toLowerCase() == 'inicial') {
          this.surveyService.getSurveyByDocumentNumber(formValues["documentNumber"])
            .then(surveyData => {
              Swal.fire({
                title: '¡Advertencia!',
                icon: 'warning',
                html: `
                <strong>Has seleccionado la encuesta inicial.</strong><br><br>
                Sin embargo, ya se encontró un registro de una encuesta inicial para el número de documento ingresado.<br>
                Por favor, revisa .
              `,
                confirmButtonText: 'Aceptar'
              })
            }).catch(error => {
              if (!this.extraQuestionsAdded) {

                this.surveySections[1].questions.push(...extraQuestions);
                this.extraQuestionsAdded = true;
              }
            });



        } else if (formValues["documentType"] && formValues["documentNumber"] && formValues["surveyType"].toLowerCase() == 'final') {
          this.surveyService.getSurveyByDocumentNumber(formValues["documentNumber"])
            .then(surveyData => {
              if(surveyData.length == 2){
                Swal.fire({
                  title: '¡Advertencia!',
                  icon: 'warning',
                  html: `
                  Se encontró un registro de una encuesta inicial y un registro de una encuesta final para el número de documento ingresado.<br>
                  Por favor, revisa y vuelve a intentarlo .
                `,
                  confirmButtonText: 'Aceptar'
                })
                return;
              }
              if (!this.extraQuestionsAdded) {

                this.surveySections[1].questions.push(...extraQuestions);
                this.extraQuestionsAdded = true;
              }

              this.surveyForm.patchValue({
                fullName: surveyData.fullName,
                age: surveyData.age,
                gender: surveyData.gender,
                nationality: surveyData.nationality,
                city: surveyData.city,
                locality: surveyData.locality,
                school: surveyData.locality,
                programYear: surveyData.programYear,
                educationLevel: surveyData.educationLevel,
              }, { emitEvent: false });

            })
            .catch(error => {
              this.surveyForm.get('surveyType')?.reset('');
              Swal.fire({
                title: '¡Advertencia!',
                text: 'Has seleccionado la encuesta final, pero no se encontró ningún registro de una encuesta inicial para el número de documento ingresado. Por favor, revisa y corrige los datos.',
                icon: 'warning',
                confirmButtonText: 'Aceptar'
              })
              console.error("Error al obtener la encuesta:", error);
            });
        }


      });

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
      const formValues = this.surveyForm.value;
      const questions: { [key: string]: any } = {};
      const demographicData: { [key: string]: any } = {};

      // Separamos las respuestas de las preguntas (cuya key empieza con 'q') de los demás campos.
      Object.keys(formValues).forEach(key => {
        if (key.startsWith('q')) {
          questions[key] = formValues[key];
        } else {
          demographicData[key] = formValues[key];
        }
      });

      // Combinamos la información, asignando las preguntas agrupadas en "questions"
      const finalData = {
        ...demographicData,
        questions: questions,
        timestamp: new Date().toISOString() // agregamos timestamp en caso de ser necesario
      };
      console.log(finalData);
      this.surveyService.addSurvey(finalData).then(() => {
        // Si la operación fue exitosa, recarga la página
        Swal.fire({
          title: '¡Éxito!',
          text: 'El formulario ha sido enviado correctamente.',
          icon: 'success',
          confirmButtonText: 'Aceptar'
        }).then(() => {
          window.location.reload();

        })
      })
        .catch((error) => {
          // Si ocurrió un error, lo muestra en consola
          console.log('Error al enviar la encuesta:', error);
        });

    }
  }

  isCurrentSectionValid(): boolean {
    let valid = true;
    this.surveySections[this.currentStep].questions.forEach(question => {
      const control = this.surveyForm.get(question.controlName);
      if (question.controlName === 'acceptDataPolicy' && control?.value !== true) {
        valid = false;
      } else if (control?.invalid) {
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
