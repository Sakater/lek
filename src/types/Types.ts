export enum TaskType {
    MultipleChoice = 'multiple-choice',
    WriteIn = 'write-in',
    Mixed = 'mixed',
}

export type Task = {
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

