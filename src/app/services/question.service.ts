import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { catchError, map, Observable, of, tap } from 'rxjs';
import { Question } from '../models/question.model';

@Injectable({
  providedIn: 'root'
})
export class QuestionService {
  private questions: Question[] | null = null;
  private mockUrl = 'assets/data/mock-questions.json';

  constructor(private http: HttpClient) { }

  loadQuestions(): Observable<Question[]> {
    if (this.questions) {
      return of(this.questions);
    } else {
      return this.http.get<Question[]>(this.mockUrl).pipe(
        tap((data) => this.questions = data),
        catchError(this.handleError))
    }
  }

  getFirstQuestion(): Observable<Question | undefined> {
    return this.loadQuestions().pipe(
      map((questions) => questions[0])
    );
  }

  getQuestionById(id: string): Observable<Question | undefined> {
    return this.loadQuestions().pipe(
      map((questions) => questions.find((q) => q.id === id))
    );
  }

  private handleError(error: any): Observable<Question[]> {
    console.error('Failed to load questions', error);
    return of([]);
  }
}
