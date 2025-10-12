//FileContext/index.ts

import {createContext} from 'react';
import type {File, Task} from '../types';

export type FileContextType = {
    file: File | null;
    openCustomizer: boolean;
    setOpenCustomizer: (open: boolean) => void;
    openTemplateSearch: boolean;
    setOpenTemplateSearch: (open: boolean) => void;
    //setFile: (file: File) => void;
    updateFile: (patch: Partial<File>) => void;
    updateTask: (taskId: string, updatedTask: Task) => void;
    deleteTask: (taskId: string) => void;
    addTask: (patch:Partial<Task>) => void;
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
    openCustomizer: false,
    setOpenCustomizer: () => {},
    openTemplateSearch: false,
    setOpenTemplateSearch: () => {},
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
    size: 1.2
});
