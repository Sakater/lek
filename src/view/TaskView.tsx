import React from 'react';
import type {Task} from '../types';
import {TaskType} from '../types';
import {MultipleChoiceView} from './taskTypes/MultipleChoiceView.tsx';
import {WriteInView} from './taskTypes/WriteInView.tsx';
import {MixedView} from './taskTypes/MixedView.tsx';
import {FillInTheBlanksView} from './taskTypes/FillInTheBlanksView.tsx';

interface TaskViewProps {
    task: Task;
    key?: React.Key;
    scroll?: boolean;
    optionsType?: 'checkbox' | 'radio' | 'hidden';
}

export const TaskView: React.FC<TaskViewProps> = ({task, optionsType='checkbox',scroll}) => {
    switch (task.type) {
        case TaskType.MULTIPLE_CHOICE:
            return <MultipleChoiceView task={task} optionsType={optionsType} scroll={scroll}/>;
        case TaskType.WRITE_IN:
            return <WriteInView task={task}/>;
        case TaskType.MIXED:
            return <MixedView task={task} optionsType={optionsType} scroll={scroll}/>;
        case TaskType.FILL_IN_THE_BLANKS:
            return <FillInTheBlanksView task={task} scroll={scroll}/>;
        default:
            return <div>Unknown task type</div>;
    }
};
