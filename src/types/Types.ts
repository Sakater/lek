export enum TaskType {
    MULTIPLE_CHOICE = 'MULTIPLE_CHOICE',
    WRITE_IN = 'WRITE_IN',
    MIXED = 'MIXED',
    FILL_IN_THE_BLANKS = 'FILL_IN_THE_BLANKS',
    LISTING = 'LISTING',
    MAPPING = 'MAPPING',
}

export enum Subject {
    Siyer = 'Siyer',
    Fikih = 'Fikih',
    Akaid = 'Akaid',
    Ahlak = 'Ahlak',
    Hadis = 'Hadis',
    Kelam = 'Kelam',
    Tefsir = 'Tefsir',
    Arapca = 'Arapca',
    Kuran = 'Kuran',
    Dini_Tarih = 'Dini_Tarih',
    Diger = 'Diger',
}

type BaseTask = {
    createdBy?: string;
    points?: number;
    level?: number;
    hint?: string;
    topic?: string;
    grade?: number;
    subject?: Subject;
    numeration: string;
    question: string;
    /**Array of options to choose from, or write in*/
    options: Option[];
    id: Id;
};

export type MultipleChoiceTask = BaseTask & {
    type: TaskType.MULTIPLE_CHOICE;
    optionsInARow: number;
};

export type WriteInTask = BaseTask & {
    type: TaskType.WRITE_IN;
    /** helping-lines per row*/
    helpingLines: number;
    /** Amount of lines given to answer (helping-lines not included*/
    totalLines: number;
};

export type MixedTask = BaseTask & {
    type: TaskType.MIXED;
    optionsInARow: number;
    /** helping-lines per row*/
    helpingLines: number;
    /** Amount of lines given to answer (helping-lines not included*/
    totalLines: number;
};

export type FillInTheBlanksTask = BaseTask & {
    type: TaskType.FILL_IN_THE_BLANKS;
    optionsInARow: number;
};

export type ListingTask = BaseTask & {
    type: TaskType.LISTING;
    optionsInARow: number;
};
export type MappingTask = BaseTask & {
    type: TaskType.MAPPING;
    optionsInARow: number;
};

export type Task =
    | MultipleChoiceTask
    | WriteInTask
    | MixedTask
    | FillInTheBlanksTask
    | ListingTask
    | MappingTask;

export type Option = {
    optionText: string;
    id: Id;
    inputType?: 'checkbox' | 'radio' | 'hidden';
    optionType?: 'source' | 'target';
};
export type Id = number;

export type File = {
    id: Id;
    title: string;
    tasks: Task[];
    date?: string;
    createdBy?: string;
    level?: number;
    topic: string[];
    grade: number;
    subject: Subject[];
};

export type TaskRequest = {
    text?: string[];
    id?: number[];
    question?: string[];
    subject?: Subject[];
    taskType?: TaskType[];
    grade?: number[];
    level?: number[];
    hint?: string[];
    createdBy?: string[];
    topic?: string[];
    // Pagination-Parameter
    page?: number;
    size?: number;
    sort?: string[];
};

export type FileRequest = {
    text?: string[];
    id?: number[];
    title?: string[];
    date?: string[];
    createdBy?: string[];
    level?: number[];
    topic?: string[];
    grade?: number[];
    subject?: Subject[];
    // Pagination
    page?: number;
    size?: number;
    sort?: string[];
};

export type Page<T> = {
    content: T[];
    page: {
        size: number;
        number: number;
        totalElements: number;
        totalPages: number;
    };
};
