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

export function TaskFormSelector({task, open, onClose}: Props) {

    switch (task.type) {
        case TaskType.MULTIPLE_CHOICE:
            return <MultipleChoiceTaskForm task={task} open={open} onClose={onClose}/>;

        case TaskType.WRITE_IN:
            return <WriteInTaskForm task={task} open={open} onClose={onClose}/>;

        case TaskType.MIXED:
            return <MixedTaskForm task={task} open={open} onClose={onClose}/>;

        case TaskType.FILL_IN_THE_BLANKS:
            return <FillInTheBlanksTaskForm task={task} open={open} onClose={onClose}/>;

        default: {
            return task; }
    }
}
