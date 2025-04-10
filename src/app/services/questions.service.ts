import { Injectable } from '@angular/core';
import { Firestore, collection, query, orderBy, getDocs } from '@angular/fire/firestore';
import { from, Observable, of } from 'rxjs';
import { map } from 'rxjs/operators';

export interface Question {
  code: string;
  text: string;
}

@Injectable({
  providedIn: 'root'
})
export class QuestionService {
  private localStorageKey = 'cachedQuestions';
  private questions$: Observable<Question[]> | undefined;
  constructor(private firestore: Firestore) { }

  getQuestions(): Observable<Question[]> {
    const cachedData = localStorage.getItem(this.localStorageKey);
    if (cachedData) {
      const questions: Question[] = JSON.parse(cachedData);
      return of(questions);
        } else {
          const questionsCollection = collection(this.firestore, 'questions');
          const q = query(questionsCollection, orderBy('code', 'asc'));
          this.questions$ = from(getDocs(q)).pipe(
            map(querySnapshot => 
              querySnapshot.docs.map(doc => doc.data() as Question)
            )
          );
        }

        this.questions$.subscribe(data => {
          localStorage.setItem(this.localStorageKey, JSON.stringify(data));
        });
        return this.questions$;

  }
}
