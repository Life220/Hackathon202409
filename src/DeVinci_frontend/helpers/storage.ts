// src/helpers/storage.ts
import type { Quiz } from '../quiz';

export function storeQuizlocally(quizID: string, quizData: Quiz): void
{
    const storedQuizzes = localStorage.getItem("quizzes");
    let quizzes: { [key: string]: Quiz } = storedQuizzes ? JSON.parse(storedQuizzes) : {};

    quizzes[quizID] = quizData;
    localStorage.setItem("quizzes", JSON.stringify(quizzes));
}

export function getCorruptionQuizzes(): { [key: string]: Quiz }
{
    const storedQuizzes = localStorage.getItem("quizzes");
    if (storedQuizzes)
    {
        let quizzes: { [key: string]: Quiz } = JSON.parse(storedQuizzes);
        let corruptionQuizzes: { [key: string]: Quiz } = {};

        for (let quizID in quizzes)
        {
            if (quizzes[quizID].subject === "Corruption")
            {
                corruptionQuizzes[quizID] = quizzes[quizID];
            }
        }

        return corruptionQuizzes;
    }

    return {};
}

export function getMathQuizzes(): { [key: string]: Quiz }
{
    const storedQuizzes = localStorage.getItem("quizzes");
    if (storedQuizzes)
    {
        let quizzes: { [key: string]: Quiz } = JSON.parse(storedQuizzes);
        let mathQuizzes: { [key: string]: Quiz } = {};

        for (let quizID in quizzes)
        {
            if (quizzes[quizID].subject === "Math")
            {
                mathQuizzes[quizID] = quizzes[quizID];
            }
        }

        return mathQuizzes;
    }

    return {};
}