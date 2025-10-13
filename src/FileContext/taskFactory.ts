// taskFactory.ts
import type { Task,  WriteInTask, MultipleChoiceTask, MixedTask, FillInTheBlanksTask, Option, Id } from '../types';
import {TaskType, Subject} from '../types';
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
        id: crypto.randomUUID() as Id
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
        id: crypto.randomUUID() as Id
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
        id: crypto.randomUUID() as Id
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
        id: crypto.randomUUID() as Id
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
        default:
            const _exhaustive: never = type;
            throw new Error(`Unknown task type: ${_exhaustive}`);
    }
};
