import { Component, OnDestroy, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Observable, Subject, switchMap, take, takeUntil } from 'rxjs';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';

import { QuestionComponent } from '../question/question.component';
import { Answer, Question } from '../../models/question.model';
import { QuestionService } from '../../services/question.service';
import { GameStateService } from '../../services/game-state.service';
import { GameState } from '../../models/game-state.model';
import { ChoicesOverviewComponent } from '../choices-overview/choices-overview.component';

@Component({
  selector: 'app-game',
  standalone: true,
  imports: [
    QuestionComponent,
    ChoicesOverviewComponent,
    MatButtonModule,
    CommonModule,
    MatIconModule
  ],
  templateUrl: './game.component.html',
  styleUrl: './game.component.css'
})
export class GameComponent implements OnInit, OnDestroy {
  private destroy$ = new Subject<void>();

  currentQuestion: Question | null = null;
  showChoicesOverview = false;

  constructor(private questionService: QuestionService, private gameStateService: GameStateService) { }

  ngOnInit(): void {
    this.initializeGame();
  }

  handleAnswerClick(answer: Answer): void {
    this.gameStateService.updateAnsweredQuestions(answer);
    this.loadNextQuestion(answer.nextQuestionId);
  }

  handleSeeYourChoicesClick(): void {
    this.showChoicesOverview = true;
  }

  resetGame(): void {
    this.resetState();
    this.loadFirstQuestion();
  }

  ngOnDestroy() {
    this.destroy$.next();
    this.destroy$.complete();
  }

  private initializeGame(): void {
    this.gameStateService.getGameState().pipe(
      take(1),
      switchMap((state: GameState) => this.loadInitialQuestion(state.currentQuestionId))
    ).subscribe((question: Question) => this.handleQuestionLoaded(question));
  }

  private loadInitialQuestion(questionId: string): Observable<Question> {
    return questionId
      ? this.questionService.getQuestionById(questionId)
      : this.questionService.getFirstQuestion();
  }

  private loadNextQuestion(nextQuestionId: string): void {
    this.questionService.getQuestionById(nextQuestionId).pipe(
      takeUntil(this.destroy$)
    ).subscribe((question: Question) => this.handleQuestionLoaded(question));
  }

  private loadFirstQuestion(): void {
    this.questionService.getFirstQuestion().pipe(
      takeUntil(this.destroy$)
    ).subscribe((question: Question) => this.handleQuestionLoaded(question));
  }

  private handleQuestionLoaded(question: Question): void {
    if (!question) return;
    this.currentQuestion = question;
    if (!this.gameStateService.getGameStateValue()?.currentQuestionId) {
      this.gameStateService.updateCurrentQuestionId(question.id);
    }
  }

  private resetState(): void {
    this.showChoicesOverview = false;
    this.currentQuestion = null;
    this.gameStateService.clearState();
  }
}
