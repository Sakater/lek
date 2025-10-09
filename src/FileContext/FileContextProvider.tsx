import React, {ReactNode, useEffect, useState} from 'react';
import type {FileContextType} from './index';
import {FileContext} from './index';
import type {File, Task} from '../types';
import {TaskType} from '../types';

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

    useEffect(() => {
        if (file) {
            localStorage.setItem('cachedFile', JSON.stringify(file));
        }
    }, [file]);
    const updateFile = (patch: Partial<File>) => {
        if (!file) return;
        setFile(prev => (prev ? {...prev, ...patch} : prev));
    };
    const addTask = (type:TaskType) => {
        function extractLeadingNumber(input: string): number | null {
            const match = input.trim().match(/^[-+]?\d+(?:[.,]\d+)?/);
            console.log("input: ", input)
            if (!match) return null;
            // Komma als Dezimaltrenner zulassen

            return Number(match[0].replace(',', '.'));
        }

        if (!file) return;

        const newTask: Task = {
            type: type,
            numeration: `${file?.tasks.length > 0 ? extractLeadingNumber(file.tasks[file.tasks.length - 1].numeration) + 1 : 1})`,
            //`${file.tasks.length>0?Number(file.tasks[file.tasks.length-1].numeration[0])  + 1:1})`,
            question: 'Neue Frage',
            options: [],
            optionsInARow: 2,
            id: crypto.randomUUID(),
            lines: 1,
            totalLines: 1
        };
        setFile({
            ...file,
            tasks: [...file.tasks, newTask]
        });
        console.log(extractLeadingNumber(file.tasks[file.tasks.length - 1].numeration) + 1 + ")");
    };
    const updateTask = (taskId: string, updatedTask: Task) => {
        if (!file) return;

        setFile({
            ...file,
            tasks: file.tasks.map(task =>
                task.id === taskId ? updatedTask : task
            )
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
                if (task.id === taskId) {
                    return {
                        ...task,
                        options: task.options.map(option =>
                            option.id === optionId ? {...option, name: newName} : option
                        )
                    };
                }
                return task;
            })
        });
    };
    const deleteOption = (taskId: string, optionId: string) => {
        if (!file) return;

        setFile({
            ...file,
            tasks: file.tasks.map(task => {
                if (task.id === taskId) {
                    return {
                        ...task,
                        options: task.options.filter(option => option.id !== optionId)
                    };
                }
                return task;
            })
        })
    }

    const dynamicSize = (expanse: number) => (expanse / size) | 0;

    const context: FileContextType = {
        file,
        //setFile,
        updateFile,
        addTask,
        updateTask,
        deleteTask,
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
