//FileContext/index.ts

import {createContext} from 'react';
import type {File, FillInTheBlanksTask, MixedTask, MultipleChoiceTask, Task, WriteInTask} from '../types';
import {TaskType} from "../types";

export type FileContextType = {
    file: File | null;
    openCustomizer: boolean;
    setOpenCustomizer: (open: boolean) => void;
    openTemplateSearch: boolean;
    setOpenTemplateSearch: (open: boolean) => void;
    updateFile: (patch: Partial<File>) => void;
    updateTask: (taskId: string, updates: Partial<Task> | Task) => void;
    deleteTask: (taskId: string) => void;

    // Function Overloads für addTask mit typspezifischen Patches
    addTask(type: TaskType.WriteIn, patch?: Partial<Omit<WriteInTask, 'numeration'>>): WriteInTask;
    addTask(type: TaskType.MultipleChoice, patch?: Partial<Omit<MultipleChoiceTask, 'numeration'>>): MultipleChoiceTask;
    addTask(type: TaskType.Mixed, patch?: Partial<Omit<MixedTask, 'numeration'>>): MixedTask;
    addTask(type: TaskType.FillInTheBlanks, patch?: Partial<Omit<FillInTheBlanksTask, 'numeration'>>): FillInTheBlanksTask;

    addOption: (taskId: string, optionName?: string) => void;
    updateOption: (taskId: string, optionId: string, newName: string) => void;
    deleteOption: (taskId: string, optionId: string) => void;
    dynamicSize: (expanse: number) => number;
    size: number;
}

// Dummy-Defaultwerte für TypeScript
export const FileContext = createContext<FileContextType>({
    file: {
        title: '',
        author: '',
        date: '',
        tasks: []
    },
    openCustomizer: false,
    setOpenCustomizer: () => {},
    openTemplateSearch: false,
    setOpenTemplateSearch: () => {},
    updateFile: () => {},
    updateTask: () => {},
    deleteTask: () => {},
    addTask: (() => {}) as any,
    addOption: () => {},
    updateOption: () => {},
    deleteOption: () => {},
    dynamicSize: () => 0,
    size: 1.2
});
