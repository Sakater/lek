import {type FileRequest, Subject, type TaskRequest, TaskType} from '../types';
import {taskTypeToText} from '../utils/EnumsToText';
import type {SearchConfig} from './GenericSearchBar'; // Den Typ importieren

// --- Helper Transformator für Zahlen ---
const toNumberArray = (vals: string[]) => vals.map((v) => Number(v)).filter((n) => !isNaN(n));

// 1. Config für TASKS
export const taskSearchConfig: SearchConfig<TaskRequest> = {
    subject: {
        label: 'Fach',
        type: 'select',
        options: Object.values(Subject).map((s) => ({ label: s, value: s })),
        placeholder: 'Fach wählen...',
    },
    taskType: {
        label: 'Aufgabentyp',
        type: 'select',
        options: Object.values(TaskType).map((t) => ({ label: taskTypeToText(t), value: t })),
    },
    grade: {
        label: 'Klasse',
        type: 'select',
        options: [1, 2, 3, 4, 5, 6, 7, 8, 9, 10].map((g) => ({ label: `Klasse ${g}`, value: g })),
        // Wichtig: Falls Backend List<Int> will, müssen wir hier nicht transformieren,
        // da Select value=g (number) schon korrekt übergibt.
    },
    id: {
        label: 'Task ID',
        type: 'tags',
        placeholder: 'ID eingeben...',
        transform: toNumberArray, // Hier nutzen wir den Transformer!
    },
    text: { label: 'Suche', type: 'tags', placeholder: 'Stichwort...' },
    createdBy: { label: 'Autor', type: 'tags' },
};

// 3. Config für FILES
export const fileSearchConfig: SearchConfig<FileRequest> = {
    id: {
        label: 'File ID',
        type: 'tags',
        placeholder: 'ID eingeben...',
        transform: toNumberArray,
    },
    title: {
        label: 'Titel',
        type: 'tags',
        placeholder: 'Titel suchen...',
    },
    subject: {
        label: 'Fach',
        type: 'select',
        options: Object.values(Subject).map((s) => ({ label: s, value: s })),
        placeholder: 'Fach wählen...',
    },
    grade: {
        label: 'Klasse',
        type: 'select',
        options: [1, 2, 3, 4, 5, 6, 7, 8, 9, 10].map((g) => ({ label: `Klasse ${g}`, value: g })),
    },
    level: {
        label: 'Schwierigkeitsgrad',
        type: 'select',
        options: [1, 2, 3, 4, 5].map((l) => ({ label: `Level ${l}`, value: l })),
    },
    topic: {
        label: 'Thema',
        type: 'tags',
        placeholder: 'Thema eingeben...',
    },
    createdBy: {
        label: 'Erstellt von',
        type: 'tags',
        placeholder: 'Autor...',
    },
    date: {
        label: 'Datum',
        type: 'tags',
        placeholder: 'TT.MM.JJJJ',
    },
    text: { label: 'Suche', type: 'tags', placeholder: 'Stichwort...' },
};
