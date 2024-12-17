import { TestBed } from '@angular/core/testing';
import { HttpClient } from '@angular/common/http';
import { provideHttpClient } from '@angular/common/http';
import { of } from 'rxjs';
import { QuestionService } from './question.service';
import { Question } from '../models/question.model';

describe('QuestionService', () => {
  let service: QuestionService;
  let httpClient: HttpClient;

  const mockQuestions: Question[] = [
    {
      id: '1',
      text: 'Question 1',
      answers: [
        { value: 'A', nextQuestionId: '2' },
        { value: 'B', nextQuestionId: '3' }
      ]
    },
    {
      id: '2',
      text: 'Question 2',
      answers: [
        { value: 'C', nextQuestionId: '4' },
        { value: 'D', nextQuestionId: '5' }
      ]
    }
  ];

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [
        QuestionService,
        provideHttpClient()
      ]
    });
    service = TestBed.inject(QuestionService);
    httpClient = TestBed.inject(HttpClient);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  it('should load questions from the mock URL', () => {
    spyOn(httpClient, 'get').and.returnValue(of(mockQuestions));

    service.loadQuestions().subscribe(questions => {
      expect(questions.length).toBe(2);
      expect(questions[0].text).toBe('Question 1');
      expect(questions[0].answers.length).toBe(2);
      expect(questions[0].answers[0].value).toBe('A');
    });
  });

  it('should get the first question', () => {
    spyOn(httpClient, 'get').and.returnValue(of(mockQuestions));

    service.getFirstQuestion().subscribe(firstQuestion => {
      expect(firstQuestion.id).toBe('1');
      expect(firstQuestion.text).toBe('Question 1');
      expect(firstQuestion.answers.length).toBe(2);
    });
  });

  it('should get question by id', () => {
    const questionIdToFind = '1';
    spyOn(httpClient, 'get').and.returnValue(of(mockQuestions));

    service.getQuestionById(questionIdToFind).subscribe((question) => {
      expect(question.id).toBe(questionIdToFind);
      expect(question.text).toBe('Question 1');
      expect(question.answers.length).toBe(2);
      expect(question.answers[0].value).toBe('A');
    });
  });
});
