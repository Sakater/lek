// MultipleChoiceTask.tsx
import React from 'react';
import type { MultipleChoiceTask as MultipleChoiceTaskType } from '../../types';
import { TaskHeader } from '../TaskHeader.tsx';
import { OptionsGrid } from '../helpers/OptionsGrid.tsx';

interface MultipleChoiceTaskProps {
    task: MultipleChoiceTaskType;
}

export const MultipleChoiceView: React.FC<MultipleChoiceTaskProps> = ({ task }) => {
    return (
        <div className="task multiple-choice-task">
            <TaskHeader
                numeration={task.numeration}
                question={task.question}
            />
            <OptionsGrid
                options={task.options}
                optionsInARow={task.optionsInARow}
                isMultipleChoice={true}
            />
        </div>
    );
};
