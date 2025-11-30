import {TaskType} from "../types";

export function taskTypeToText(taskType:TaskType):string{
    switch (taskType){
        case TaskType.MULTIPLE_CHOICE:
            return "Multiple Choice";
        case TaskType.WRITE_IN:
            return "Freitext";
        case TaskType.MIXED:
            return "Mixed";
        case TaskType.FILL_IN_THE_BLANKS:
            return "Lückentext";
        default:
            return "Unknown Task Type";
    }
}
export function textToTaskType(text:string):TaskType{
    switch (text.toLowerCase()){
        case "multiple choice":
            return TaskType.MULTIPLE_CHOICE;
        case "freitext":
            return TaskType.WRITE_IN;
        case "mixed":
            return TaskType.MIXED;
        case "lückentext":
            return TaskType.FILL_IN_THE_BLANKS;
        default:
            throw new Error("Unknown Task Type text: " + text);
    }
}