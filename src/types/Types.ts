export enum TaskType {
    MultipleChoice = 'Multiple-Choice',
    WriteIn = 'Freitext',
    Mixed = 'Mixed',
    FillInTheBlanks = 'Lückentext',
}

export enum Subject {
    Siyer = 'Siyer',
    Fikih = 'Fikih',
    Akaid = 'Akaid',
    Hadis = 'Hadis',
    Kelam = 'Kelam',
    Tefsir = 'Tefsir',
    Arapca = 'Arapça',
    Kuran = 'Kuran',
    DiniTarih = 'Dini Tarih',
    Diger = 'Diğer',
}

type BaseTask = {
    subject?: Subject;
    numeration: string;
    question: string;
    /**Array of options to choose from, or write in*/
    options: Option[];
    id: Id;
};

export type MultipleChoiceTask = BaseTask & {
    type: TaskType.MultipleChoice;
    optionsInARow: number;
};

export type WriteInTask = BaseTask & {
    type: TaskType.WriteIn;
    /** helping-lines per row*/
    helpingLines: number;
    /** Amount of lines given to answer (helping-lines not included*/
    totalLines: number;
};

export type MixedTask = BaseTask & {
    type: TaskType.Mixed;
    optionsInARow: number;
    /** helping-lines per row*/
    helpingLines: number;
    /** Amount of lines given to answer (helping-lines not included*/
    totalLines: number;
};

export type FillInTheBlanksTask = BaseTask & {
    type: TaskType.FillInTheBlanks;
    optionsInARow: number;
};

export type Task = MultipleChoiceTask | WriteInTask | MixedTask | FillInTheBlanksTask;



export type Option = {
    name: string;
    id: Id;
}
export type Id = string;


export type File = {

    title: string;
    tasks: Task[];
    author: string;
    date: string;

}

