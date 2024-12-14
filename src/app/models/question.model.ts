export interface Answer {
    value: string;
    nextQuestionId: string;
}
export interface Question {
    id: string;
    text: string;
    answers: Answer[];
}