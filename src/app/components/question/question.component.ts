import { Component, EventEmitter, Input, Output } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { CommonModule } from '@angular/common';
import { Answer, Question } from '../../models/question.model';

@Component({
  selector: 'app-question',
  standalone: true,
  imports: [CommonModule, MatButtonModule],
  templateUrl: './question.component.html',
  styleUrl: './question.component.css'
})
export class QuestionComponent {
  @Input() question?: Question;
  @Output() answerSelected: EventEmitter<Answer> = new EventEmitter();

  onAnswerClick(answer: Answer): void {
    this.answerSelected.emit(answer);
  }
}
