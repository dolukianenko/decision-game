import { CommonModule } from '@angular/common';
import { Component, OnDestroy, OnInit } from '@angular/core';
import { MatCardModule } from '@angular/material/card';
import { Subject, switchMap, takeUntil } from 'rxjs';
import { GameState } from '../../models/game-state.model';
import { QuestionService } from '../../services/question.service';
import { GameStateService } from '../../services/game-state.service';
import { ChoicesOverview } from '../../models/choices-overview.model';

@Component({
  selector: 'app-choices-overview',
  standalone: true,
  imports: [CommonModule, MatCardModule],
  templateUrl: './choices-overview.component.html',
  styleUrl: './choices-overview.component.css'
})
export class ChoicesOverviewComponent implements OnInit, OnDestroy {
  private destroy$ = new Subject<void>();
  choicesOverviewList: ChoicesOverview[] = [];

  constructor(private questionService: QuestionService, private gameStateService: GameStateService) { }

  ngOnInit(): void {
    this.gameStateService.getGameState().pipe(
      takeUntil(this.destroy$),
      switchMap((state: GameState) => {
        return this.questionService.mapAnsweredQuestionsToChoices(state.answeredQuestions)
      })
    ).subscribe((data: ChoicesOverview[]) => this.choicesOverviewList = data);
  }

  ngOnDestroy() {
    this.destroy$.next();
    this.destroy$.complete();
  }
}