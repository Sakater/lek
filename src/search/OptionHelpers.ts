// OptionHelpers.ts
import {type TaskRequest, Subject, TaskType} from '../types';
import {textToTaskType} from "../utils/EnumsToText.ts";

export const parseSearchTags = (tags: string[]): TaskRequest => {
    const request: TaskRequest = {
        text: [],
        subject: [],
        taskType: [],
        grade: [],
        level: [],
    };

    tags.forEach(tag => {
        if (tag.includes('=')) {
            const [rawKey, rawValue] = tag.split('=');
            const key = rawKey.trim().toLowerCase();
            const value = rawValue.trim(); // Originalwert (z.B. für grade)
            const valueLower = value.toLowerCase(); // Für Case-Insensitive Vergleich

            switch (key) {
                case 'subject':
                case 'fach':
                    // Wir suchen im Enum nach einem Wert, der (kleingeschrieben) passt
                {
                    const subjectMatch = Object.values(Subject).find(
                        s => s.toLowerCase() === valueLower
                    );
                    if (subjectMatch) {
                        request.subject?.push(subjectMatch);
                    }
                    break;
                }

                case 'type':
                case 'typ': {
                    const typeMatch = Object.values(TaskType).find(
                        t => {
                            console.log("t: ", t);
                            console.log("textToTaskType(valueLower): ", textToTaskType(valueLower));
                            return t.toLowerCase() === textToTaskType(valueLower).toLowerCase();

                        }
                    );
                    if (typeMatch) {
                        request.taskType?.push(typeMatch);
                    }
                    break;
                }

                case 'grade':
                case 'klasse':
                case 'stufe':
                    if (!isNaN(Number(value))) {
                        request.grade?.push(Number(value));
                    }
                    break;

                default:
                    request.text?.push(tag);
            }
        } else {
            request.text?.push(tag);
        }
    });

    return request;
};
