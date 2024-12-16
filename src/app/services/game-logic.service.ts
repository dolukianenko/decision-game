import { Injectable } from '@angular/core';
import { Observable, of } from 'rxjs';
import { switchMap } from 'rxjs/operators';
import { GameStateService } from './game-state.service';
import { QuestionService } from './question.service';
import { GameState } from '../models/game-state.model';

@Injectable({
  providedIn: 'root'
})
export class GameLogicService {
  constructor(
    private gameStateService: GameStateService,
    private questionService: QuestionService
  ) { }

  isSeeYourChoicesButtonVisible(): Observable<boolean> {
    return this.gameStateService.getGameState().pipe(
      switchMap((state: GameState) => {
        if (!state.currentQuestionId) {
          return of(false);
        }
        return this.questionService.isLastQuestion(state.currentQuestionId);
      })
    );
  }
}
