import { Injectable } from '@angular/core';
import { Firestore, collection, addDoc } from '@angular/fire/firestore';

@Injectable({
  providedIn: 'root'
})
export class SurveyService {

  constructor(private firestore: Firestore) { }

  /**
   * Guarda una encuesta en la colección "surveys".
   * @param surveyData Objeto con los datos de la encuesta.
   * @returns Una promesa que se resuelve con el documento creado.
   */
  async addSurvey(surveyData: any): Promise<any> {
    // Agregamos un timestamp y otros metadatos si es necesario.
    surveyData.timestamp = new Date().toISOString();

    try {
      const surveysCollection = collection(this.firestore, 'surveys');
      const docRef = await addDoc(surveysCollection, surveyData);
      console.log('Encuesta guardada correctamente, ID:', docRef.id);
      return docRef;
    } catch (error) {
      console.error('Error al guardar la encuesta:', error);
      throw error;
    }
  }
}
