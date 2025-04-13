import { Injectable } from '@angular/core';
import { Firestore, collection, addDoc, getDocs, doc, getDoc, updateDoc, deleteDoc, query, where } from '@angular/fire/firestore';

@Injectable({
  providedIn: 'root'
})
export class SurveyService {

  private surveyCache: Map<string, any> = new Map<string, any>();

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

  /**
   * Obtiene todas las encuestas guardadas en la colección "surveys".
   * @returns Una promesa que se resuelve con un arreglo de encuestas.
   */
  async getSurveys(): Promise<any[]> {
    try {
      const surveysCollection = collection(this.firestore, 'surveys');
      const querySnapshot = await getDocs(surveysCollection);
      // Convertimos cada documento en un objeto que incluye su ID.
      const surveys = querySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
      return surveys;
    } catch (error) {
      console.error('Error al obtener las encuestas:', error);
      throw error;
    }
  }

  async getSurveyById(id: string): Promise<any> {
    try {
      const surveyDocRef = doc(this.firestore, `surveys/${id}`);
      const surveySnapshot = await getDoc(surveyDocRef);
      if (surveySnapshot.exists()) {
        return { id: surveySnapshot.id, ...surveySnapshot.data() };
      } else {
        throw new Error('La encuesta no existe');
      }
    } catch (error) {
      console.error('Error al obtener la encuesta:', error);
      throw error;
    }
  }

  async updateSurvey(id: string, surveyData: any): Promise<void> {
    try {
      const surveyDocRef = doc(this.firestore, `surveys/${id}`);
      await updateDoc(surveyDocRef, surveyData);
      console.log('Encuesta actualizada correctamente.');
    } catch (error) {
      console.error('Error al actualizar la encuesta:', error);
      throw error;
    }
  }

  async deleteSurvey(id: string): Promise<void> {
    try {
      const surveyDocRef = doc(this.firestore, `surveys/${id}`);
      await deleteDoc(surveyDocRef);
      console.log('Encuesta eliminada correctamente.');
    } catch (error) {
      console.error('Error al eliminar la encuesta:', error);
      throw error;
    }
  }

  async getSurveyByDocumentNumber(documentNumber: string): Promise<any> {

    if (this.surveyCache.has(documentNumber)) {
      return this.surveyCache.get(documentNumber);
    }
    try {
      const surveysCollectionRef = collection(this.firestore, 'surveys');
      // Creamos una consulta que busque encuestas con el número de documento especificado
      const q = query(surveysCollectionRef, where('documentNumber', '==', documentNumber));
      const querySnapshot = await getDocs(q);

      if (querySnapshot.empty) {
        throw new Error('No se encontró la encuesta con ese número de documento');
      }
      
      // Si se espera que el número de documento sea único, retornamos la primera encuesta encontrada.
      const surveyDoc = querySnapshot.docs[0];
      const result = { id: surveyDoc.id, ...surveyDoc.data() };
      this.surveyCache.set(documentNumber, result);
      return result;
    } catch (error) {
      console.error('Error al obtener la encuesta:', error);
      throw error;
    }
  }
}

