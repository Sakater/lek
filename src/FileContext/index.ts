//FileContext/index.ts

import {createContext} from 'react';
import type {File, Task} from '../types';
import {TaskType} from "../types";

export type FileContextType = {
    file: File | null;
    openCustomizer: boolean;
    setOpenCustomizer: (open: boolean) => void;
    openTemplateSearch: boolean;
    setOpenTemplateSearch: (open: boolean) => void;
    updateFile: (patch: Partial<File>) => void;
    updateTask: (taskId: number, updates: Partial<Task> | Task) => void;
    deleteTask: (taskId: number) => void;

    // Function Overloads für addTask mit typspezifischen Patches
    // addTask(type: TaskType.WRITE_IN, patch?: Partial<Omit<WriteInTask, 'numeration'>>): WriteInTask;
    // addTask(type: TaskType.MULTIPLE_CHOICE, patch?: Partial<Omit<MultipleChoiceTask, 'numeration'>>): MultipleChoiceTask;
    // addTask(type: TaskType.MIXED, patch?: Partial<Omit<MixedTask, 'numeration'>>): MixedTask;
    //addTask(type: TaskType.FILL_IN_THE_BLANKS, patch?: Partial<Omit<FillInTheBlanksTask, 'numeration'>>): FillInTheBlanksTask;
    addTask(type: TaskType, patch?: Partial<Omit<Task, 'numeration'| 'id' | 'type'>>, index?:number): Task;

    addOption: (taskId: number, optionName?: string) => void;
    updateOption: (taskId: number, optionId: number, newName: string) => void;
    deleteOption: (taskId: number, optionId: number) => void;
    dynamicSize: (expanse: number) => number;
    size: number;
}

// Dummy-Defaultwerte für TypeScript
export const FileContext = createContext<FileContextType>({
    file: {
        id: 0,
        title: '',
        createdBy: '',
        date: '',
        tasks: [],
        topic: [],
        grade: 0,
        subject: []
    },
    openCustomizer: false,
    setOpenCustomizer: () => {},
    openTemplateSearch: false,
    setOpenTemplateSearch: () => {},
    updateFile: () => {},
    updateTask: () => {},
    deleteTask: () => {},
    addTask: (() => {}) as unknown as () => Task,
    addOption: () => {},
    updateOption: () => {},
    deleteOption: () => {},
    dynamicSize: () => 0,
    size: 1.2
});
