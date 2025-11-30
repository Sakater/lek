// Alle möglichen Felder aus deinem TaskRequest
import {Subject, type TaskRequest, TaskType} from "../types";
import {taskTypeToText} from "../utils/EnumsToText.ts";

type FilterField = keyof TaskRequest;

// Konfiguration: Wie verhält sich jedes Feld?
interface FilterDefinition {
    label: string;
    type: 'select' | 'tags' | 'number-tags'; // 'number-tags' für IDs/Level
    options?: { label: string; value: any }[]; // Nur für Selects nötig
    placeholder?: string;
}
export const FILTER_DEFINITIONS: Partial<Record<FilterField, FilterDefinition>> = {
    // 1. Enum / Auswahl Felder
    subject: {
        label: 'Fach',
        type: 'select',
        options: Object.values(Subject).map(s => ({ label: s, value: s })),
        placeholder: 'Fächer wählen...'
    },
    taskType: {
        label: 'Aufgabentyp',
        type: 'select',
        options: Object.values(TaskType).map(t => ({ label: taskTypeToText(t), value: t })),
        placeholder: 'Typen wählen...'
    },
    grade: {
        label: 'Klasse',
        type: 'select', // Select ist hier besser als NumberInput, da begrenzte Auswahl
        options: [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12].map(g => ({ label: `Klasse ${g}`, value: g })),
        placeholder: 'Klassen wählen...'
    },
    level: {
        label: 'Schwierigkeit',
        type: 'select',
        options: [1, 2, 3].map(l => ({ label: `Level ${l}`, value: l })), // Annahme: Level 1-3
        placeholder: 'Level wählen...'
    },

    // 2. Freitext Felder (Texteingabe mit Enter für mehrere)
    text: { label: 'Volltext', type: 'tags', placeholder: 'Suchbegriffe eingeben...' },
    question: { label: 'Frage', type: 'tags', placeholder: 'Fragetext enthält...' },
    topic: { label: 'Thema', type: 'tags', placeholder: 'Themen (z.B. Gebet)...' },
    hint: { label: 'Hinweis', type: 'tags', placeholder: 'Hinweistext enthält...' },
    createdBy: { label: 'Erstellt von', type: 'tags', placeholder: 'Autoren Namen...' },

    // 3. Zahlen Felder
    id: { label: 'ID', type: 'tags', placeholder: 'IDs eingeben (Enter)...' }, // Nutzen tags für mehrere IDs
};