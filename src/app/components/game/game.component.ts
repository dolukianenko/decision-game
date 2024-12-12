import { Component } from '@angular/core';
import { QuestionComponent } from '../question/question.component';
import { DiagramComponent } from '../diagram/diagram.component';

@Component({
  selector: 'app-game',
  standalone: true,
  imports: [QuestionComponent, DiagramComponent],
  templateUrl: './game.component.html',
  styleUrl: './game.component.css'
})
export class GameComponent { }
