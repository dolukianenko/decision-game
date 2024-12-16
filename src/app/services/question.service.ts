import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { catchError, map, Observable, of, tap } from 'rxjs';
import { Question } from '../models/question.model';
import { AnsweredQuestion } from '../models/game-state.model';
import { ChoicesOverview } from '../models/choices-overview.model';

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

  getFirstQuestion(): Observable<Question> {
    return this.loadQuestions().pipe(map((questions) => questions[0]));
  }

  getQuestionById(id: string): Observable<Question> {
    return this.loadQuestions().pipe(
      map((questions) => questions.find((q) => q.id === id) || { id: 'notFound', text: 'Question not found', answers: [] })
    );
  }

  isLastQuestion(questionId: string): Observable<boolean> {
    return this.getQuestionById(questionId).pipe(
      map((question) => question.answers.length === 0)
    );
  }

  mapAnsweredQuestionsToChoices(answeredQuestions: AnsweredQuestion[]): Observable<ChoicesOverview[]> {
    return this.loadQuestions().pipe(
      map((questions) => {
        const idToAnswerMap = new Map<string, string>();
        answeredQuestions.forEach((item) => idToAnswerMap.set(item.questionId, item.selectedAnswer));

        return questions
          .filter((question) => idToAnswerMap.has(question.id))
          .map((question) => ({
            answeredQuestionText: question.text,
            selectedAnswer: idToAnswerMap.get(question.id) || 'No Answer'
          }));
      })
    );
  }

  private handleError(error: unknown): Observable<Question[]> {
    if (error instanceof Error) {
      console.error('Failed to load questions', error.message);
    } else {
      console.error('Failed to load questions', error);
    }
    return of([]);
  }
}
