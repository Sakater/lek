import type {File, Task, TaskRequest} from '../types';
import {Subject, TaskType} from '../types';
import dummyFiles from '../dummy_files.json';

const BaseUrl = import.meta.env.VITE_BACKEND_URL || '';

export async function searchTasks(queries: TaskRequest): Promise<Task[]> {
    const response = await fetch(BaseUrl+'/api/search/tasks', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(queries)
    });
    const data = await response.json();
    return data.tasks;/*
    console.log('Searching tasks with queries:', queries);
    return [
        {
            subject: Subject.Siyer,
            type: TaskType.MULTIPLE_CHOICE,
            numeration: "1",
            question: "Was ist Siyer?",
            options: [{optionText: "Lebensgeschichte", id: 1}, {optionText: "Gebet", id: 2}],
            optionsInARow: 2,
            id: 1,
        },
        {
            subject: Subject.Fikih,
            type: TaskType.WRITE_IN,
            numeration: "2",
            question: "Was bedeutet Fikih?",
            options: [{optionText: "", id: 2}],
            id: 2,
            helpingLines: 2,
            totalLines: 2,
        },
        {
            subject: Subject.Akaid,
            type: TaskType.MIXED,
            numeration: "3",
            question: "Nenne ein Beispiel für Akaid.",
            options: [{optionText: "Glaube", id: 4}, {optionText: "Handlung", id: 5}],
            optionsInARow: 2,
            id: 3,
            helpingLines: 1,
            totalLines: 1,
        },
        {
            subject: Subject.Hadis,
            type: TaskType.FILL_IN_THE_BLANKS,
            numeration: "4",
            question: "Fülle die Lücke: Hadis ist ...",
            options: [{optionText: "", id: 6}],
            optionsInARow: 1,
            id: 4,
        },
        {
            subject: Subject.Kelam,
            type: TaskType.MULTIPLE_CHOICE,
            numeration: "5",
            question: "Was ist Kelam?",
            options: [{optionText: "Theologie", id: 7}, {optionText: "Geschichte", id: 8}],
            optionsInARow: 2,
            id: 5,
        },
        {
            subject: Subject.Tefsir,
            type: TaskType.WRITE_IN,
            numeration: "6",
            question: "Was macht ein Tefsir?",
            options: [{optionText: "", id: 9}],
            id: 6,
            helpingLines: 2,
            totalLines: 2,
        },
        {
            subject: Subject.Arapca,
            type: TaskType.MIXED,
            numeration: "7",
            question: "Was ist Arapça?",
            options: [{optionText: "Sprache", id:10 }, {optionText: "Land", id: 11}],
            optionsInARow: 2,
            id: 7,
            helpingLines: 1,
            totalLines: 1,
        },
        {
            subject: Subject.Kuran,
            type: TaskType.FILL_IN_THE_BLANKS,
            numeration: "8",
            question: "Kuran ist das ... Buch.",
            options: [{optionText: "", id: 12}],
            optionsInARow: 1,
            id: 8,
        },
        {
            subject: Subject.Dini_Tarih,
            type: TaskType.MULTIPLE_CHOICE,
            numeration: "9",
            question: "Was ist Dini Tarih?",
            options: [{optionText: "Religiöse Geschichte", id: 13}, {optionText: "Mathematik", id: 14}],
            optionsInARow: 2,
            id: 9,
        },
        {
            subject: Subject.Diger,
            type: TaskType.WRITE_IN,
            numeration: "10",
            question: "Was fällt unter 'Diğer'?",
            options: [{optionText: "", id: 15}],
            id: 10,
            helpingLines: 2,
            totalLines: 2,
        },
        {
            type: TaskType.FILL_IN_THE_BLANKS,
            numeration: "1.",
            question: "Der Prophet Muhammad wurde in {0} geboren und lebte im {1} Jahrhundert.",
            options: [
                {id: 1, optionText: "Mekka"},
                {id: 2, optionText: "Medina"},
                {id: 3, optionText: "6."},
                {id: 4, optionText: "7."}
            ],
            optionsInARow: 2,
            id: 1
        },
        {
            type: TaskType.WRITE_IN,
            numeration: "2.",
            question: "Erkläre die fünf Säulen des Islam:",
            options: [
                {id: 1, optionText: "Schahada"},
                {id: 2, optionText: "Salat"},
                {id: 3, optionText: "Zakat"},
                {id: 4, optionText: "Saum"},
                {id: 5, optionText: "Hadsch"}
            ],
            helpingLines: 2,
            totalLines: 8,
            id: 5
        },
        {
            type: TaskType.MIXED,
            numeration: "3.",
            question: "Welche Eigenschaften hatte der Prophet Muhammad?",
            options: [
                {id: 1, optionText: "Ehrlich"},
                {id: 3, optionText: "Barmherzig"},
                {id: 4, optionText: "Geduldig"},
                {id: 2, optionText: "Gerecht"}
            ],
            optionsInARow: 2,
            helpingLines: 1,
            totalLines: 5,
            id: 1
        }
    ]*/
}

export async function searchFiles(queries: string[]): Promise<File[]> {
    console.log('Searching tasks with queries:', queries);

    /*const response = await fetch(BaseUrl+'/api/search/files', {
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
    const taskToSave = {
        ...task,
        type: task.type ? Object.keys(TaskType).find(
            key => TaskType[key as keyof typeof TaskType] === task.type
        ) : undefined
    };
    await fetch(BaseUrl+'/api/save/task', {
        body: JSON.stringify(taskToSave),
        headers: {
            'Content-Type': 'application/json'
        },
        method: 'POST'
    }).then(() => console.log('Task saved successfully')).catch(err => console.error('Error saving task:', err));
}