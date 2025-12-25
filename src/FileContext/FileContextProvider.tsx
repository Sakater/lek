import {type ReactNode, useEffect, useState} from 'react';
import type {FileContextType} from './index';
import {FileContext} from './index';
import {
    type File,
    type FillInTheBlanksTask,
    type MixedTask,
    type MultipleChoiceTask,
    type Option,
    type Task,
    TaskType,
    type WriteInTask
} from '../types';
import {createTask} from "./taskFactory.ts";
import type {ListingTask, MappingTask} from "../types/Types.ts";


type Props = {
    children: ReactNode;
}


const initialFile = () => {
    const fileFromStorage = localStorage.getItem('cachedFile');
    return fileFromStorage ? JSON.parse(fileFromStorage) : {
        type: TaskType.MULTIPLE_CHOICE,
        title: 'Mein Dokument',
        author: 'Autor',
        date: new Date().toLocaleDateString('de-DE', {day: '2-digit', month: '2-digit', year: '2-digit'}),
        tasksPerPage: 5,
        tasks: []
    }
};

export function FileContextProvider({children}: Props) {
    const [file, setFile] = useState<File | null>(initialFile);
    const size: number = 1.5
    const [openCustomizer, setOpenCustomizer] = useState<boolean>(false);
    const [openTemplateSearch, setOpenTemplateSearch] = useState<boolean>(false);

    useEffect(() => {
        if (file) {
            localStorage.setItem('cachedFile', JSON.stringify(file));
        }
    }, [file]);

    const updateFile = (patch: Partial<File>) => {
        if (!file) return;
        setFile(prev => (prev ? {...prev, ...patch} : prev));
    };


    // // Überladungen für addTask
    // function addTask(type: TaskType.WRITE_IN, patch?: Partial<Omit<WriteInTask, 'numeration'>>): WriteInTask;
    // function addTask(type: TaskType.MULTIPLE_CHOICE, patch?: Partial<Omit<MultipleChoiceTask, 'numeration'>>): MultipleChoiceTask;
    // function addTask(type: TaskType.MIXED, patch?: Partial<Omit<MixedTask, 'numeration'>>): MixedTask;
    // function addTask(type: TaskType.FILL_IN_THE_BLANKS, patch?: Partial<Omit<FillInTheBlanksTask, 'numeration'>>): FillInTheBlanksTask;
    function addTask(type: TaskType, patch: Partial<Omit<Task, 'numeration' | 'id' | 'type'>> = {}, index?: number): Task {
        function extractLeadingNumber(input: string): number | null {
            const match = input.trim().match(/[-+]?\d+(?:[.,]\d+)?/);
            if (!match) return null;
            return Number(match[0].replace(',', '.'));
        }

        if (!file) {
            // Fallback, wenn kein file vorhanden - sollte nicht passieren
            throw new Error('File not initialized');
        }

        const nextNumber = file?.tasks.length > 0
            ? (extractLeadingNumber(file.tasks[file.tasks.length - 1].numeration) ?? 0) + 1
            : 1;

        const newTask = createTask(type, {
            ...patch,
            numeration: `${nextNumber})`
        });

        setFile(prev => {
            if (!prev) return prev;
            const tasks = [...prev.tasks];

            if (index !== undefined) {
                tasks.splice(index + 1, 0, newTask);
            } else {
                tasks.push(newTask);
            }

            return {...prev, tasks};
        });
        return newTask;
    }


    const updateTask = (taskId: number, updates: Partial<Task> | Task) => {
        if (!file) return;
        setFile({
            ...file,
            tasks: file.tasks.map(task => {
                if (task.id !== taskId) return task;

                // Wenn updates ein vollständiger Task ist, einfach verwenden,
                // ansonsten mergen
                const updatedTask = {...task, ...updates};

                // Type preservation
                switch (task.type) {
                    case TaskType.WRITE_IN:
                        return updatedTask as WriteInTask;
                    case TaskType.MULTIPLE_CHOICE:
                        return updatedTask as MultipleChoiceTask;
                    case TaskType.MIXED:
                        return updatedTask as MixedTask;
                    case TaskType.FILL_IN_THE_BLANKS:
                        return updatedTask as FillInTheBlanksTask;
                    case TaskType.LISTING:
                        return updatedTask as ListingTask;
                    case TaskType.MAPPING:
                        return updatedTask as MappingTask;
                    default: {
                        return task;
                    }
                }
            })
        });
    };

    const deleteTask = (taskId: number) => {
        if (!file) return;

        setFile({
            ...file,
            tasks: file.tasks.filter(task => task.id !== taskId)
        });
    };
    const returnOptionsWithType = (task: Task, updatedOptions: Option[]) => {
        switch (task.type) {
            case TaskType.WRITE_IN:
                return {...task, options: updatedOptions} as WriteInTask;
            case TaskType.MULTIPLE_CHOICE:
                return {...task, options: updatedOptions} as MultipleChoiceTask;
            case TaskType.MIXED:
                return {...task, options: updatedOptions} as MixedTask;
            case TaskType.FILL_IN_THE_BLANKS:
                return {...task, options: updatedOptions} as FillInTheBlanksTask;
            case TaskType.LISTING:
                return {...task, options: updatedOptions} as ListingTask;
            case TaskType.MAPPING:
                return {...task, options: updatedOptions} as MappingTask;
            default: {
                return task;
            }
        }
    }
    const addOption = (taskId: number, optionText: string = 'Neue Option') => {
        if (!file) return;

        setFile({
            ...file,
            tasks: file.tasks.map(task => {
                if (task.id !== taskId) return task;
                // Neue Option erstellen
                const newOption = {
                    id: crypto.randomUUID() as unknown as number,
                    optionText: optionText,
                    inputType: task.type === TaskType.LISTING ? 'hidden' as const : 'checkbox' as const,
                    optionType: task.type === TaskType.MAPPING ? 'source' as const : undefined
                };

                const updatedOptions = [...task.options, newOption];

                // Type-spezifische Rückgabe
                return returnOptionsWithType(task, updatedOptions);
            })
        });
    };


    const updateOption = (taskId: number, optionId: number, updates: Partial<Option> | Option) => {
        if (!file) return;

        setFile({
            ...file,
            tasks: file.tasks.map(task => {
                if (task.id !== taskId) return task;

                // Typsichere Aktualisierung basierend auf dem Task-Typ
                const updatedOptions = task.options.map(option =>
                    option.id === optionId ? {...option, ...updates} : option
                );

                // Type-spezifische Rückgabe, um Discriminated Union zu erhalten
                return returnOptionsWithType(task, updatedOptions);
            })
        });
    };

    const deleteOption = (taskId: number, optionId: number) => {
        if (!file) return;

        setFile({
            ...file,
            tasks: file.tasks.map(task => {
                if (task.id !== taskId) return task;

                // Gefilterte Options
                const filteredOptions = task.options.filter(option => option.id !== optionId);

                // Type-spezifische Rückgabe
                return returnOptionsWithType(task, filteredOptions);
            })
        });
    };


    const dynamicSize = (expanse: number) => (expanse / size) | 0;

    const context: FileContextType = {
        file,
        openCustomizer,
        setOpenCustomizer,
        openTemplateSearch,
        setOpenTemplateSearch,
        updateFile,
        updateTask,
        deleteTask,
        addTask,
        addOption,
        updateOption,
        deleteOption,
        dynamicSize,
        size

    };

    // React 19: Direktes Verwenden von FileContext statt FileContext.Provider
    return (
        <FileContext value={context}>
            {children}
        </FileContext>
    );
}
