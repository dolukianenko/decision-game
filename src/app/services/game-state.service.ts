import { Injectable } from '@angular/core';
import { BehaviorSubject, catchError, Observable, of } from 'rxjs';
import { AnsweredQuestion, GameState } from '../models/game-state.model';
import { Answer } from '../models/question.model';

const DEFAULT_GAME_STATE: GameState = {
  currentQuestionId: '',
  answeredQuestions: []
};

@Injectable({
  providedIn: 'root'
})
export class GameStateService {
  private readonly storageKey = 'gameState';
  private gameState$: BehaviorSubject<GameState> = new BehaviorSubject<GameState>(this.loadState());

  getGameState(): Observable<GameState> {
    return this.gameState$.asObservable().pipe(
      catchError((error) => {
        console.error('Error fetching game state:', error);
        return of(DEFAULT_GAME_STATE);
      }))
  }

  setGameState(newState: GameState): void {
    try {
      localStorage.setItem(this.storageKey, JSON.stringify(newState));
      this.gameState$.next(newState);
    } catch (e) {
      console.error('Error saving game state:', e);
    }
  }

  clearState(): void {
    localStorage.removeItem(this.storageKey);
    this.setGameState(DEFAULT_GAME_STATE);
  }

  updateCurrentQuestionId(questionId: string): void {
    const currentState = this.gameState$.getValue();
    const updatedState: GameState = {
      ...currentState,
      currentQuestionId: questionId
    };
    this.setGameState(updatedState);
  }

  updateAnsweredQuestions(answer: Answer): void {
    const currentState = this.gameState$.getValue();
    const newAnsweredQuestion: AnsweredQuestion = {
      questionId: currentState.currentQuestionId,
      selectedAnswer: answer.value
    };

    const updatedState: GameState = {
      ...currentState,
      currentQuestionId: answer.nextQuestionId,
      answeredQuestions: [
        ...(currentState.answeredQuestions || []),
        newAnsweredQuestion
      ]
    };
    this.setGameState(updatedState);
  }

  private loadState(): GameState {
    const storedState = localStorage.getItem(this.storageKey);
    if (storedState) {
      try {
        return JSON.parse(storedState) as GameState;
      } catch (e) {
        console.error('Error parsing game state from localStorage:', e);
      }
    }
    return DEFAULT_GAME_STATE;
  }

  getGameStateValue(): GameState | null {
    return this.gameState$.getValue();
  }
}
