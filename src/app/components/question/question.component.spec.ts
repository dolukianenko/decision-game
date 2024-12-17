import { ComponentFixture, TestBed } from '@angular/core/testing';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MatIconModule } from '@angular/material/icon';
import { CommonModule } from '@angular/common';
import { of } from 'rxjs';
import { QuestionComponent } from './question.component';
import { GameLogicService } from '../../services/game-logic.service';
import { Answer } from '../../models/question.model';

describe('QuestionComponent', () => {
  let component: QuestionComponent;
  let fixture: ComponentFixture<QuestionComponent>;
  let gameLogicServiceSpy: jasmine.SpyObj<GameLogicService>;

  beforeEach(async () => {
    gameLogicServiceSpy = jasmine.createSpyObj('GameLogicService', ['isSeeYourChoicesButtonVisible']);

    await TestBed.configureTestingModule({
      imports: [CommonModule, MatButtonModule, MatCardModule, MatIconModule],
      providers: [
        { provide: GameLogicService, useValue: gameLogicServiceSpy }
      ]
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(QuestionComponent);
    component = fixture.componentInstance;
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should initialize isSeeYourChoicesButtonVisible from GameLogicService', () => {
    gameLogicServiceSpy.isSeeYourChoicesButtonVisible.and.returnValue(of(true));
    fixture.detectChanges();
    expect(component.isSeeYourChoicesButtonVisible).toBeTrue();
  });

  it('should emit answerSelected when an answer is clicked', () => {
    const mockAnswer: Answer = { value: 'A', nextQuestionId: '2' };
    spyOn(component.answerSelected, 'emit');
    component.onAnswerClick(mockAnswer);
    expect(component.answerSelected.emit).toHaveBeenCalledWith(mockAnswer);
  });

  it('should emit seeYourChoicesClicked when the "See Your Choices" button is clicked', () => {
    spyOn(component.seeYourChoicesClicked, 'emit');
    component.onSeeYourChoicesClick();
    expect(component.seeYourChoicesClicked.emit).toHaveBeenCalled();
  });
});
