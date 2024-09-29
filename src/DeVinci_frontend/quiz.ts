export interface Quiz
{
    id: number;
    subject: string;
    scenario: string;
    questions: Array<{
        question: string;
        userAnswer: string;
        feedback: string;
        correctness: number;
    }>;    
}