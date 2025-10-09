//FileContext/index.ts

import {createContext} from 'react';
import type {File, Task, TaskType} from '../types';

export type FileContextType = {
    file: File | null;
    //setFile: (file: File) => void;
    updateFile: (patch: Partial<File>) => void;
    updateTask: (taskId: string, updatedTask: Task) => void;
    deleteTask: (taskId: string) => void;
    addTask: (type:TaskType) => void;
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
        tasksPerPage: 0,
        tasks: []
    },
    //setFile: () => {},
    updateFile: () => {
    },
    updateTask: () => {
    },
    deleteTask: () => {
    },
    addTask: () => {
    },
    updateOption: () => {
    },
    deleteOption: () => {
    },
    dynamicSize: () => 0,
    size: 1
});
