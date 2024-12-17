import { TestBed } from '@angular/core/testing';

import { GameStateService } from './game-state.service';
import { AnsweredQuestion, GameState } from '../models/game-state.model';
import { Answer } from '../models/question.model';

describe('GameStateService', () => {
  let service: GameStateService;

  beforeEach(() => {
    localStorage.clear();

    spyOn(localStorage, 'getItem').and.callFake((key: string) => {
      return key === 'gameState' ? '{"currentQuestionId": "1", "answeredQuestions": []}' : null;
    });
    spyOn(localStorage, 'setItem').and.callFake(() => {});
    spyOn(localStorage, 'removeItem').and.callFake(() => {});

    TestBed.configureTestingModule({});
    service = TestBed.inject(GameStateService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  it('should load game state from localStorage', () => {
    service.getGameState().subscribe(state => {
      expect(state.currentQuestionId).toBe('1');
      expect(state.answeredQuestions.length).toBe(0);
    });
  });

  it('should save game state to localStorage', () => {
    const newState: GameState = {
      currentQuestionId: '2',
      answeredQuestions: [{ questionId: '1', selectedAnswer: 'A' }]
    };

    service.setGameState(newState);

    expect(localStorage.setItem).toHaveBeenCalledWith('gameState', JSON.stringify(newState));
  });

  it('should clear game state and reset to default', () => {
    service.clearState();
    
    expect(localStorage.removeItem).toHaveBeenCalledWith('gameState');

    service.getGameState().subscribe(state => {
      expect(state).toEqual({
        currentQuestionId: '',
        answeredQuestions: []
      });
    });
  });

  it('should update the currentQuestionId in the game state', () => {
    const newQuestionId = '2';
    
    service.updateCurrentQuestionId(newQuestionId);
    
    service.getGameState().subscribe(state => {
      expect(state.currentQuestionId).toBe(newQuestionId);
    });
  });

  it('should update answered questions correctly', () => {
    const answer: Answer = { value: 'A', nextQuestionId: '2' };
    const initialState: GameState = {
      currentQuestionId: '1',
      answeredQuestions: []
    };
    
    service.setGameState(initialState);    
    service.updateAnsweredQuestions(answer);
    
    service.getGameState().subscribe(state => {
      const answeredQuestion: AnsweredQuestion = state.answeredQuestions[0];
      expect(answeredQuestion.questionId).toBe('1');
      expect(answeredQuestion.selectedAnswer).toBe('A');
      expect(state.currentQuestionId).toBe('2');
    });
  });
});
