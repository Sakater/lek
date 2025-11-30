import { Subject, TaskType, type TaskRequest } from '../types';
import { taskTypeToText } from "../utils/EnumsToText";
import type { SearchConfig } from './GenericSearchBar'; // Den Typ importieren

// --- Helper Transformator für Zahlen ---
const toNumberArray = (vals: string[]) => vals.map(v => Number(v)).filter(n => !isNaN(n));


// 1. Config für TASKS
export const taskSearchConfig: SearchConfig<TaskRequest> = {
    subject: {
        label: 'Fach',
        type: 'select',
        options: Object.values(Subject).map(s => ({ label: s, value: s })),
        placeholder: 'Fach wählen...'
    },
    taskType: {
        label: 'Aufgabentyp',
        type: 'select',
        options: Object.values(TaskType).map(t => ({ label: taskTypeToText(t), value: t })),
    },
    grade: {
        label: 'Klasse',
        type: 'select',
        options: [1,2,3,4,5,6,7,8,9,10].map(g => ({ label: `Klasse ${g}`, value: g })),
        // Wichtig: Falls Backend List<Int> will, müssen wir hier nicht transformieren,
        // da Select value=g (number) schon korrekt übergibt.
    },
    id: {
        label: 'Task ID',
        type: 'tags',
        placeholder: 'ID eingeben...',
        transform: toNumberArray // Hier nutzen wir den Transformer!
    },
    text: { label: 'Suche', type: 'tags', placeholder: 'Stichwort...' },
    createdBy: { label: 'Autor', type: 'tags' }
};


// 2. Neuer Typ für Files (Beispiel)
export interface FileRequest {
    filename?: string[];
    author?: string[];
    fileType?: string[]; // pdf, docx...
    uploadDate?: string[];
}

// 3. Config für FILES
export const fileSearchConfig: SearchConfig<FileRequest> = {
    filename: {
        label: 'Dateiname',
        type: 'tags',
        placeholder: 'Name enthält...'
    },
    author: {
        label: 'Hochgeladen von',
        type: 'tags'
    },
    fileType: {
        label: 'Dateityp',
        type: 'select',
        options: [
            { label: 'PDF Dokument', value: 'pdf' },
            { label: 'Word Datei', value: 'docx' },
            { label: 'Excel Tabelle', value: 'xlsx' }
        ]
    }
};
