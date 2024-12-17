import { ComponentFixture, TestBed } from '@angular/core/testing';
import { provideHttpClient } from '@angular/common/http';
import { of } from 'rxjs';
import { GameComponent } from './game.component';
import { GameStateService } from '../../services/game-state.service';
import { QuestionService } from '../../services/question.service';
import { Question } from '../../models/question.model';

describe('GameComponent', () => {
  let component: GameComponent;
  let fixture: ComponentFixture<GameComponent>;
  let questionServiceSpy: jasmine.SpyObj<QuestionService>;
  let gameStateServiceSpy: jasmine.SpyObj<GameStateService>;

  const mockQuestion: Question = {
    id: '1',
    text: 'Sample Question',
    answers: [{ value: 'A', nextQuestionId: '2' }]
  };

  beforeEach(async () => {
    questionServiceSpy = jasmine.createSpyObj('QuestionService', ['getQuestionById', 'getFirstQuestion']);
    gameStateServiceSpy = jasmine.createSpyObj('GameStateService', ['getGameState', 'updateAnsweredQuestions', 'updateCurrentQuestionId', 'clearState']);

    await TestBed.configureTestingModule({
      imports: [GameComponent],
      providers: [
        provideHttpClient(),
        { provide: QuestionService, useValue: questionServiceSpy },
        { provide: GameStateService, useValue: gameStateServiceSpy }
      ]
    }).compileComponents();

    fixture = TestBed.createComponent(GameComponent);
    component = fixture.componentInstance;
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should load the last saved question if currentQuestionId exists in game state', () => {
    gameStateServiceSpy.getGameState.and.returnValue(of({ currentQuestionId: '1', answeredQuestions: [] }));
    questionServiceSpy.getQuestionById.and.returnValue(of(mockQuestion));

    fixture.detectChanges();

    expect(component.currentQuestion).toEqual(mockQuestion);
    expect(gameStateServiceSpy.getGameState).toHaveBeenCalled();
    expect(questionServiceSpy.getQuestionById).toHaveBeenCalledWith('1');
  });
  
  it('should load the first question if currentQuestionId does not exist in game state', () => {
    gameStateServiceSpy.getGameState.and.returnValue(of({ currentQuestionId: '', answeredQuestions: [] }));
    questionServiceSpy.getFirstQuestion.and.returnValue(of(mockQuestion));

    fixture.detectChanges();

    expect(component.currentQuestion).toEqual(mockQuestion);
    expect(questionServiceSpy.getFirstQuestion).toHaveBeenCalled();
  });

  it('should handle See Your Choices click', () => {
    component.handleSeeYourChoicesClick();
    expect(component.showChoicesOverview).toBeTrue();
  });
});