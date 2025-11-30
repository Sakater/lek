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
}

export const TaskView: React.FC<TaskViewProps> = ({ task }) => {
    switch (task.type) {
        case TaskType.MULTIPLE_CHOICE:
            return <MultipleChoiceView task={task} />;
        case TaskType.WRITE_IN:
            return <WriteInView task={task} />;
        case TaskType.MIXED:
            return <MixedView task={task} />;
        case TaskType.FILL_IN_THE_BLANKS:
            return <FillInTheBlanksView task={task} />;
        default:
            return <div>Unknown task type</div>;
    }
};
