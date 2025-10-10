export enum TaskType {
    MultipleChoice = 'Multiple-Choice',
    WriteIn = 'Textfeld',
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

export type Task = {
    subject?: Subject;
    type?: TaskType;
    numeration: string
    question: string;
    options: Option[]; //Array of options to choose from, or write in
    optionsInARow: number;
    id: Id;
    /**
     * helping-lines per row
     * */
    lines: number;
    totalLines: number

}
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
    tasksPerPage: number;

}

