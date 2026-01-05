import React from 'react';
import type {Task} from '../types';
import {TaskType} from '../types';
import {MultipleChoiceView} from './taskTypes/MultipleChoiceView.tsx';
import {WriteInView} from './taskTypes/WriteInView.tsx';
import {MixedView} from './taskTypes/MixedView.tsx';
import {FillInTheBlanksView} from './taskTypes/FillInTheBlanksView.tsx';
import {ListingView} from "./taskTypes/ListingView.tsx";
import {MappingView} from "./taskTypes/MappingView.tsx";
import "./helpers/View.css"

interface TaskViewProps {
    task: Task;
    key?: React.Key;
    scroll?: boolean;
}

export const TaskView: React.FC<TaskViewProps> = ({task,scroll}) => {
    switch (task.type) {
        case TaskType.MAPPING:
            return <MappingView task={task} scroll={scroll}/>;
        case TaskType.LISTING:
            return <ListingView task={task} scroll={scroll}/>;
        case TaskType.MULTIPLE_CHOICE:
            return <MultipleChoiceView task={task}  scroll={scroll}/>;
        case TaskType.WRITE_IN:
            return <WriteInView task={task}/>;
        case TaskType.MIXED:
            return <MixedView task={task} scroll={scroll}/>;
        case TaskType.FILL_IN_THE_BLANKS:
            return <FillInTheBlanksView task={task} scroll={scroll}/>;
        default:
            return <div>Unknown task type</div>;
    }
};
