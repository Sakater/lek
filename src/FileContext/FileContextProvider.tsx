import React, {ReactNode, useEffect, useState} from 'react';
import type {FileContextType} from './index';
import {FileContext} from './index';
import type {File, FillInTheBlanksTask, MixedTask, MultipleChoiceTask, Task, WriteInTask} from '../types';
import {TaskType} from '../types';
import {createTask} from "./taskFactory.ts";


type Props = {
    children: ReactNode;
}


const initialFile = () => {
    const fileFromStorage = localStorage.getItem('cachedFile');
    return fileFromStorage ? JSON.parse(fileFromStorage) : {
        type: TaskType.MultipleChoice,
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


    /*const addTask = (patchTask: Partial<Task>={}) => {
        function extractLeadingNumber(input: string): number | null {
            const match = input.trim().match(/^[-+]?\d+(?:[.,]\d+)?/);
            if (!match) return null;
            // Komma als Dezimaltrenner zulassen

            return Number(match[0].replace(',', '.'));
        }

        if (!file) return;

        const baseTask: Task = {
            type: TaskType.WriteIn,
            subject: Subject.Akaid,
            numeration: `${file?.tasks.length > 0 ? extractLeadingNumber(file.tasks[file.tasks.length - 1].numeration) + 1 : 1})`,
            //`${file.tasks.length>0?Number(file.tasks[file.tasks.length-1].numeration[0])  + 1:1})`,
            question: 'Neue Frage',
            options: [],
            optionsInARow: 2,
            id: crypto.randomUUID(),
            helpingLines: 1,
            totalLines: 1
        };
        const newTask = {...baseTask, ...patchTask};
        setFile({
            ...file,
            tasks: [...file.tasks, newTask]
        });
    };*/

    // Überladungen für addTask
    function addTask(type: TaskType.WriteIn, patch?: Partial<Omit<WriteInTask, 'numeration'>>): WriteInTask;
    function addTask(type: TaskType.MultipleChoice, patch?: Partial<Omit<MultipleChoiceTask, 'numeration'>>): MultipleChoiceTask;
    function addTask(type: TaskType.Mixed, patch?: Partial<Omit<MixedTask, 'numeration'>>): MixedTask;
    function addTask(type: TaskType.FillInTheBlanks, patch?: Partial<Omit<FillInTheBlanksTask, 'numeration'>>): FillInTheBlanksTask;
    function addTask(type: TaskType, patch: Partial<Omit<TaskType, 'numeration'>> = {}): Task {
        console.log('Adding task of type:', type, 'with patch:', patch);
        function extractLeadingNumber(input: string): number | null {
            const match = input.trim().match(/^[-+]?\\d+(?:[.,]\\d+)?/);
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

        setFile({
            ...file,
            tasks: [...file.tasks, newTask]
        });

        // Task zurückgeben!
        return newTask;
    }


    const updateTask = (taskId: string, updates: Partial<Task> | Task) => {
        if (!file) return;

        setFile({
            ...file,
            tasks: file.tasks.map(task => {
                if (task.id !== taskId) return task;

                // Wenn updates ein vollständiger Task ist, einfach verwenden
                // Ansonsten mergen
                const updatedTask = { ...task, ...updates };

                // Type preservation
                switch (task.type) {
                    case TaskType.WriteIn:
                        return updatedTask as WriteInTask;
                    case TaskType.MultipleChoice:
                        return updatedTask as MultipleChoiceTask;
                    case TaskType.Mixed:
                        return updatedTask as MixedTask;
                    case TaskType.FillInTheBlanks:
                        return updatedTask as FillInTheBlanksTask;
                    default:
                        const _exhaustive: never = task;
                        return task;
                }
            })
        });
    };

    const deleteTask = (taskId: string) => {
        if (!file) return;

        setFile({
            ...file,
            tasks: file.tasks.filter(task => task.id !== taskId)
        });
    };

    const updateOption = (taskId: string, optionId: string, newName: string) => {
        if (!file) return;

        setFile({
            ...file,
            tasks: file.tasks.map(task => {
                if (task.id !== taskId) return task;

                // Typsichere Aktualisierung basierend auf dem Task-Typ
                const updatedOptions = task.options.map(option =>
                    option.id === optionId ? { ...option, name: newName } : option
                );

                // Type-spezifische Rückgabe, um Discriminated Union zu erhalten
                switch (task.type) {
                    case TaskType.WriteIn:
                        return { ...task, options: updatedOptions } as WriteInTask;
                    case TaskType.MultipleChoice:
                        return { ...task, options: updatedOptions } as MultipleChoiceTask;
                    case TaskType.Mixed:
                        return { ...task, options: updatedOptions } as MixedTask;
                    case TaskType.FillInTheBlanks:
                        return { ...task, options: updatedOptions } as FillInTheBlanksTask;
                    default:
                        const _exhaustive: never = task;
                        return task;
                }
            })
        });
    };

    const deleteOption = (taskId: string, optionId: string) => {
        if (!file) return;

        setFile({
            ...file,
            tasks: file.tasks.map(task => {
                if (task.id !== taskId) return task;

                // Gefilterte Options
                const filteredOptions = task.options.filter(option => option.id !== optionId);

                // Type-spezifische Rückgabe
                switch (task.type) {
                    case TaskType.WriteIn:
                        return { ...task, options: filteredOptions } as WriteInTask;
                    case TaskType.MultipleChoice:
                        return { ...task, options: filteredOptions } as MultipleChoiceTask;
                    case TaskType.Mixed:
                        return { ...task, options: filteredOptions } as MixedTask;
                    case TaskType.FillInTheBlanks:
                        return { ...task, options: filteredOptions } as FillInTheBlanksTask;
                    default:
                        const _exhaustive: never = task;
                        return task;
                }
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
