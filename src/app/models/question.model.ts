export interface Answer {
    value: string;
    nextQuestionId: string;
    isSelected?: boolean;
}
export interface Question {
    id: string;
    text: string;
    answers: Answer[];
    isVisited?: boolean;
}