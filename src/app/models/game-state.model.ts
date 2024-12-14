export interface AnsweredQuestion {
    questionId: string | undefined;
    selectedAnswer: string;
}

export interface GameState {
    currentQuestionId: string;
    answeredQuestions: AnsweredQuestion[];
}