import { TestBed } from '@angular/core/testing';
import { of } from 'rxjs';

import { GameLogicService } from './game-logic.service';
import { GameStateService } from './game-state.service';
import { QuestionService } from './question.service';
import { GameState } from '../models/game-state.model';

describe('GameLogicService', () => {
  let service: GameLogicService;
  let gameStateServiceSpy: jasmine.SpyObj<GameStateService>;
  let questionServiceSpy: jasmine.SpyObj<QuestionService>;

  beforeEach(() => {
    const gameStateSpy = jasmine.createSpyObj('GameStateService', ['getGameState']);
    const questionSpy = jasmine.createSpyObj('QuestionService', ['isLastQuestion']);

    TestBed.configureTestingModule({
      providers: [
        GameLogicService,
        { provide: GameStateService, useValue: gameStateSpy },
        { provide: QuestionService, useValue: questionSpy }
      ]
    });

    service = TestBed.inject(GameLogicService);
    gameStateServiceSpy = TestBed.inject(GameStateService) as jasmine.SpyObj<GameStateService>;
    questionServiceSpy = TestBed.inject(QuestionService) as jasmine.SpyObj<QuestionService>;
  });

  it('should return false if currentQuestionId is empty', (done) => {
    const mockGameState: GameState = { currentQuestionId: '', answeredQuestions: [] };

    gameStateServiceSpy.getGameState.and.returnValue(of(mockGameState));

    service.isSeeYourChoicesButtonVisible().subscribe((isVisible) => {
      expect(isVisible).toBeFalse();
      expect(gameStateServiceSpy.getGameState).toHaveBeenCalled();
      expect(questionServiceSpy.isLastQuestion).not.toHaveBeenCalled();
      done();
    });
  });

  it('should return true if currentQuestionId is the last question', (done) => {
    const mockGameState: GameState = { currentQuestionId: '2', answeredQuestions: [] };

    gameStateServiceSpy.getGameState.and.returnValue(of(mockGameState));
    questionServiceSpy.isLastQuestion.and.returnValue(of(true));

    service.isSeeYourChoicesButtonVisible().subscribe((isVisible) => {
      expect(isVisible).toBeTrue();
      expect(gameStateServiceSpy.getGameState).toHaveBeenCalled();
      expect(questionServiceSpy.isLastQuestion).toHaveBeenCalledWith('2');
      done();
    });
  });

  it('should return false if currentQuestionId is not the last question', (done) => {
    const mockGameState: GameState = {
      currentQuestionId: '2',
      answeredQuestions: [{
        questionId: '1',
        selectedAnswer: 'A'
      }]
    };

    gameStateServiceSpy.getGameState.and.returnValue(of(mockGameState));
    questionServiceSpy.isLastQuestion.and.returnValue(of(false));

    service.isSeeYourChoicesButtonVisible().subscribe((isVisible) => {
      expect(isVisible).toBeFalse();
      expect(gameStateServiceSpy.getGameState).toHaveBeenCalled();
      expect(questionServiceSpy.isLastQuestion).toHaveBeenCalledWith('2');
      done();
    });
  });
});
