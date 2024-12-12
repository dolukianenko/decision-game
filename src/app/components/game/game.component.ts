import { Component } from '@angular/core';
import { Subject, takeUntil } from 'rxjs';
import { QuestionComponent } from '../question/question.component';
import { DiagramComponent } from '../diagram/diagram.component';
import { Answer, Question } from '../../models/question.model';
import { QuestionService } from '../../services/question.service';

@Component({
  selector: 'app-game',
  standalone: true,
  imports: [QuestionComponent, DiagramComponent],
  templateUrl: './game.component.html',
  styleUrl: './game.component.css'
})
export class GameComponent {
  private destroy$ = new Subject<void>();
  currentQuestion: Question | undefined;

  constructor(private questionService: QuestionService) { }

  ngOnInit(): void {
    this.getStartingQuestion();
  }

  getStartingQuestion(): void {
    this.questionService.getFirstQuestion()
      .pipe(takeUntil(this.destroy$))
      .subscribe((firstQuestion) => this.currentQuestion = firstQuestion);
  }

  handleAnswerClick(answer: Answer) {
    this.getNextQuestion(answer.nextQuestionId);
  }

  getNextQuestion(id: string) {
    this.questionService.getQuestionById(id)
      .pipe(takeUntil(this.destroy$))
      .subscribe((question) => this.currentQuestion = question);
  }

  ngOnDestroy() {
    this.destroy$.next();
    this.destroy$.complete();
  }
}
