import type {Task} from '../types';
import {Subject, TaskType} from '../types';

export async function searchTasks(queries: string[]): Promise<Task[]> {
    /*const response = await fetch('/api/tasks/search', {
        method: 'GET',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({ queries })
    });
    const data = await response.json();
    return data.tasks;*/

    return [
        {
            subject: Subject.Siyer,
            type: TaskType.MultipleChoice,
            numeration: "1",
            question: "Was ist Siyer?",
            options: [{name: "Lebensgeschichte", id: "opt1"}, {name: "Gebet", id: "opt2"}],
            optionsInARow: 2,
            id: "task1",
            lines: 1,
            totalLines: 1,
        },
        {
            subject: Subject.Fikih,
            type: TaskType.WriteIn,
            numeration: "2",
            question: "Was bedeutet Fikih?",
            options: [{name: "", id: "opt3"}],
            optionsInARow: 1,
            id: "task2",
            lines: 2,
            totalLines: 2,
        },
        {
            subject: Subject.Akaid,
            type: TaskType.Mixed,
            numeration: "3",
            question: "Nenne ein Beispiel für Akaid.",
            options: [{name: "Glaube", id: "opt4"}, {name: "Handlung", id: "opt5"}],
            optionsInARow: 2,
            id: "task3",
            lines: 1,
            totalLines: 1,
        },
        {
            subject: Subject.Hadis,
            type: TaskType.FillInTheBlanks,
            numeration: "4",
            question: "Fülle die Lücke: Hadis ist ...",
            options: [{name: "", id: "opt6"}],
            optionsInARow: 1,
            id: "task4",
            lines: 1,
            totalLines: 1,
        },
        {
            subject: Subject.Kelam,
            type: TaskType.MultipleChoice,
            numeration: "5",
            question: "Was ist Kelam?",
            options: [{name: "Theologie", id: "opt7"}, {name: "Geschichte", id: "opt8"}],
            optionsInARow: 2,
            id: "task5",
            lines: 1,
            totalLines: 1,
        },
        {
            subject: Subject.Tefsir,
            type: TaskType.WriteIn,
            numeration: "6",
            question: "Was macht ein Tefsir?",
            options: [{name: "", id: "opt9"}],
            optionsInARow: 1,
            id: "task6",
            lines: 2,
            totalLines: 2,
        },
        {
            subject: Subject.Arapca,
            type: TaskType.Mixed,
            numeration: "7",
            question: "Was ist Arapça?",
            options: [{name: "Sprache", id: "opt10"}, {name: "Land", id: "opt11"}],
            optionsInARow: 2,
            id: "task7",
            lines: 1,
            totalLines: 1,
        },
        {
            subject: Subject.Kuran,
            type: TaskType.FillInTheBlanks,
            numeration: "8",
            question: "Kuran ist das ... Buch.",
            options: [{name: "", id: "opt12"}],
            optionsInARow: 1,
            id: "task8",
            lines: 1,
            totalLines: 1,
        },
        {
            subject: Subject.DiniTarih,
            type: TaskType.MultipleChoice,
            numeration: "9",
            question: "Was ist Dini Tarih?",
            options: [{name: "Religiöse Geschichte", id: "opt13"}, {name: "Mathematik", id: "opt14"}],
            optionsInARow: 2,
            id: "task9",
            lines: 1,
            totalLines: 1,
        },
        {
            subject: Subject.Diger,
            type: TaskType.WriteIn,
            numeration: "10",
            question: "Was fällt unter 'Diğer'?",
            options: [{name: "", id: "opt15"}],
            optionsInARow: 1,
            id: "task10",
            lines: 2,
            totalLines: 2,
        },
    ]
}