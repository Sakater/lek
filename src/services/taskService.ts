import type {File, Task} from '../types';
import {Subject, TaskType} from '../types';
import dummyFiles from '../dummy_files.json';

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
    console.log('Searching tasks with queries:', queries);
    return [
        {
            subject: Subject.Siyer,
            type: TaskType.MultipleChoice,
            numeration: "1",
            question: "Was ist Siyer?",
            options: [{value: "Lebensgeschichte", id: "opt1"}, {value: "Gebet", id: "opt2"}],
            optionsInARow: 2,
            id: "task1",
        },
        {
            subject: Subject.Fikih,
            type: TaskType.WriteIn,
            numeration: "2",
            question: "Was bedeutet Fikih?",
            options: [{value: "", id: "opt3"}],
            id: "task2",
            helpingLines: 2,
            totalLines: 2,
        },
        {
            subject: Subject.Akaid,
            type: TaskType.Mixed,
            numeration: "3",
            question: "Nenne ein Beispiel für Akaid.",
            options: [{value: "Glaube", id: "opt4"}, {value: "Handlung", id: "opt5"}],
            optionsInARow: 2,
            id: "task3",
            helpingLines: 1,
            totalLines: 1,
        },
        {
            subject: Subject.Hadis,
            type: TaskType.FillInTheBlanks,
            numeration: "4",
            question: "Fülle die Lücke: Hadis ist ...",
            options: [{value: "", id: "opt6"}],
            optionsInARow: 1,
            id: "task4",
        },
        {
            subject: Subject.Kelam,
            type: TaskType.MultipleChoice,
            numeration: "5",
            question: "Was ist Kelam?",
            options: [{value: "Theologie", id: "opt7"}, {value: "Geschichte", id: "opt8"}],
            optionsInARow: 2,
            id: "task5",
        },
        {
            subject: Subject.Tefsir,
            type: TaskType.WriteIn,
            numeration: "6",
            question: "Was macht ein Tefsir?",
            options: [{value: "", id: "opt9"}],
            id: "task6",
            helpingLines: 2,
            totalLines: 2,
        },
        {
            subject: Subject.Arapca,
            type: TaskType.Mixed,
            numeration: "7",
            question: "Was ist Arapça?",
            options: [{value: "Sprache", id: "opt10"}, {value: "Land", id: "opt11"}],
            optionsInARow: 2,
            id: "task7",
            helpingLines: 1,
            totalLines: 1,
        },
        {
            subject: Subject.Kuran,
            type: TaskType.FillInTheBlanks,
            numeration: "8",
            question: "Kuran ist das ... Buch.",
            options: [{value: "", id: "opt12"}],
            optionsInARow: 1,
            id: "task8",
        },
        {
            subject: Subject.DiniTarih,
            type: TaskType.MultipleChoice,
            numeration: "9",
            question: "Was ist Dini Tarih?",
            options: [{value: "Religiöse Geschichte", id: "opt13"}, {value: "Mathematik", id: "opt14"}],
            optionsInARow: 2,
            id: "task9",
        },
        {
            subject: Subject.Diger,
            type: TaskType.WriteIn,
            numeration: "10",
            question: "Was fällt unter 'Diğer'?",
            options: [{value: "", id: "opt15"}],
            id: "task10",
            helpingLines: 2,
            totalLines: 2,
        },
        {
            type: TaskType.FillInTheBlanks,
            numeration: "1.",
            question: "Der Prophet Muhammad wurde in {0} geboren und lebte im {1} Jahrhundert.",
            options: [
                { id: "1", value: "Mekka" },
                { id: "2", value: "Medina" },
                { id: "3", value: "6." },
                { id: "4", value: "7." }
            ],
            optionsInARow: 2,
            id: "task-1"
        },
        {
            type: TaskType.WriteIn,
            numeration: "2.",
            question: "Erkläre die fünf Säulen des Islam:",
            options: [
                { id: "1", value: "Schahada" },
                { id: "2", value: "Salat" },
                { id: "3", value: "Zakat" },
                { id: "4", value: "Saum" },
                { id: "5", value: "Hadsch" }
            ],
            helpingLines: 2,
            totalLines: 8,
            id: "task-2"
        },
        {
            type: TaskType.Mixed,
            numeration: "3.",
            question: "Welche Eigenschaften hatte der Prophet Muhammad?",
            options: [
                { id: "1", value: "Ehrlich" },
                { id: "2", value: "Barmherzig" },
                { id: "3", value: "Geduldig" },
                { id: "4", value: "Gerecht" }
            ],
            optionsInARow: 2,
            helpingLines: 1,
            totalLines: 5,
            id: "task-3"
        }
    ]
}

export async function searchFiles(queries: string[]): Promise<File[]> {
    console.log('Searching tasks with queries:', queries);

    /*const response = await fetch('/api/tasks/search', {
        method: 'GET',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({ queries })
    });
    const data = await response.json();
    return data.tasks;*/
    // Type Guard zur Validierung
    function isFileArray(data: unknown): data is File[] {
        if (!Array.isArray(data)) return false;

        return data.every((item: File) =>
            typeof item.title === 'string' &&
            typeof item.author === 'string' &&
            typeof item.date === 'string' &&
            Array.isArray(item.tasks)
        );
    }
    if (isFileArray(dummyFiles)) {
        return dummyFiles;
    }
    throw new Error('Invalid file structure in JSON');
}
export async function saveTask(task: Partial<Task>): Promise<void> {
    //*await fetch('/api/tasks/save', {
}