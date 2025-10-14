import React from 'react';
import type {Task} from '../types';
import {TaskType} from '../types';
import {MultipleChoiceTaskForm} from './taskTypes/MultipleChoiceTaskForm.tsx';
import {WriteInTaskForm} from './taskTypes/WriteInTaskForm.tsx';
import {MixedTaskForm} from './taskTypes/MixedTaskForm.tsx';
import {FillInTheBlanksTaskForm} from './taskTypes/FillInTheBlanksTaskForm.tsx';

type Props = {
    task: Task;
    open: boolean;
    onClose: () => void;
};

export function TaskFormSelector({ task, open, onClose }: Props) {

    switch (task.type) {
        case TaskType.MultipleChoice:
            return <MultipleChoiceTaskForm task={task} open={open} onClose={onClose} />;

        case TaskType.WriteIn:
            return <WriteInTaskForm task={task} open={open} onClose={onClose} />;

        case TaskType.Mixed:
            return <MixedTaskForm task={task} open={open} onClose={onClose} />;

        case TaskType.FillInTheBlanks:
            return <FillInTheBlanksTaskForm task={task} open={open} onClose={onClose} />;

        default:
            const _exhaustiveCheck: never = task;
            return _exhaustiveCheck;
    }
}
