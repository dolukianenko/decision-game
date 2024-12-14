import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';
import { GameState } from '../models/game-state.model';

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
    return this.gameState$.asObservable();
  }

  setGameState(newState: GameState): void {
    localStorage.setItem(this.storageKey, JSON.stringify(newState));
    this.gameState$.next(newState);
  }

  clearState(): void {
    localStorage.removeItem(this.storageKey);
    this.gameState$.next(DEFAULT_GAME_STATE);
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
}
