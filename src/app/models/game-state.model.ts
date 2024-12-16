export interface AnsweredQuestion {
    questionId: string;
    selectedAnswer: string;
}

export interface GameState {
    currentQuestionId: string;
    answeredQuestions: AnsweredQuestion[];
}