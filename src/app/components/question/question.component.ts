import { Component, EventEmitter, Input, Output } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MatIconModule } from '@angular/material/icon';
import { CommonModule } from '@angular/common';
import { Subject, takeUntil } from 'rxjs';
import { Answer, Question } from '../../models/question.model';
import { GameLogicService } from '../../services/game-logic.service';

@Component({
  selector: 'app-question',
  standalone: true,
  imports: [CommonModule, MatButtonModule, MatCardModule, MatIconModule],
  templateUrl: './question.component.html',
  styleUrl: './question.component.css'
})
export class QuestionComponent {
  @Input() question: Question | null = null;
  @Output() answerSelected: EventEmitter<Answer> = new EventEmitter<Answer>();
  @Output() seeYourChoicesClicked: EventEmitter<void> = new EventEmitter<void>();

  isSeeYourChoicesButtonVisible = false;
  private destroy$ = new Subject<void>();

  constructor(private gameLogicService: GameLogicService) {}

  ngOnInit(): void {
    this.gameLogicService
      .isSeeYourChoicesButtonVisible()
      .pipe(takeUntil(this.destroy$))
      .subscribe((visible: boolean) => this.isSeeYourChoicesButtonVisible = visible);
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }

  onAnswerClick(answer: Answer): void {
    this.answerSelected.emit(answer);
  }

  onSeeYourChoicesClick(): void {
    this.seeYourChoicesClicked.emit();
  }
}
