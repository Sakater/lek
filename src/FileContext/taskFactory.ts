// taskFactory.ts
import type {FillInTheBlanksTask, Id, MixedTask, MultipleChoiceTask, Option, Task, WriteInTask} from '../types';
import {Subject, TaskType} from '../types';


// Hilfsfunktion für UUID-Generierung mit Fallback
const generateUUID = (): string => {
    if (typeof crypto !== 'undefined' && crypto.randomUUID) {
        return crypto.randomUUID();
    }

    // Fallback für unsichere Kontexte
    return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, (c) => {
        const r = Math.random() * 16 | 0;
        const v = c === 'x' ? r : (r & 0x3 | 0x8);
        return v.toString(16);
    });
};

// Factory-Funktion für WriteInTask
export const createWriteInTask = (overrides: Partial<WriteInTask> = {}): WriteInTask => {
    const baseTask: WriteInTask = {
        type: TaskType.WriteIn,
        subject: Subject.Akaid,
        numeration: '1)',
        question: 'Neue Frage',
        options: [] as Option[],
        helpingLines: 1,
        totalLines: 1,
        id: generateUUID() as Id
    };

    return {
        ...baseTask,
        ...overrides,
        type: TaskType.WriteIn // Type sicherstellen, falls überschrieben
    };
};

// Factory-Funktion für MultipleChoiceTask
export const createMultipleChoiceTask = (overrides: Partial<MultipleChoiceTask> = {}): MultipleChoiceTask => {
    const baseTask: MultipleChoiceTask = {
        type: TaskType.MultipleChoice,
        subject: Subject.Akaid,
        numeration: '1)',
        question: 'Neue Frage',
        options: [] as Option[],
        optionsInARow: 2,
        id: generateUUID() as Id
    };

    return {
        ...baseTask,
        ...overrides,
        type: TaskType.MultipleChoice
    };
};

// Factory-Funktion für MixedTask
export const createMixedTask = (overrides: Partial<MixedTask> = {}): MixedTask => {
    const baseTask: MixedTask = {
        type: TaskType.Mixed,
        subject: Subject.Akaid,
        numeration: '1)',
        question: 'Neue Frage',
        options: [] as Option[],
        optionsInARow: 2,
        helpingLines: 1,
        totalLines: 1,
        id: generateUUID() as Id
    };

    return {
        ...baseTask,
        ...overrides,
        type: TaskType.Mixed
    };
};

// Factory-Funktion für FillInTheBlanksTask
export const createFillInTheBlanksTask = (overrides: Partial<FillInTheBlanksTask> = {}): FillInTheBlanksTask => {
    const baseTask: FillInTheBlanksTask = {
        type: TaskType.FillInTheBlanks,
        subject: Subject.Akaid,
        numeration: '1)',
        question: 'Neue Frage mit {0} und {1}',
        options: [] as Option[],
        optionsInARow: 2,
        id: generateUUID() as Id
    };

    return {
        ...baseTask,
        ...overrides,
        type: TaskType.FillInTheBlanks
    };
};

// Haupt-Factory mit Exhaustiveness Check
export const createTask = (type: TaskType, overrides: Partial<Task> = {}): Task => {
    switch (type) {
        case TaskType.WriteIn:
            return createWriteInTask(overrides as Partial<WriteInTask>);
        case TaskType.MultipleChoice:
            return createMultipleChoiceTask(overrides as Partial<MultipleChoiceTask>);
        case TaskType.Mixed:
            return createMixedTask(overrides as Partial<MixedTask>);
        case TaskType.FillInTheBlanks:
            return createFillInTheBlanksTask(overrides as Partial<FillInTheBlanksTask>);
        default: {
            throw new Error(`Unknown task type: ${type}`); }
    }
};
