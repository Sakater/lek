// MultipleChoiceTask.tsx
import React from 'react';
import type {MultipleChoiceTask as MultipleChoiceTaskType} from '../../types';
import {TaskHeader} from '../TaskHeader.tsx';
import {OptionsGrid} from '../helpers/OptionsGrid.tsx';

interface MultipleChoiceTaskProps {
    task: MultipleChoiceTaskType;
    scroll?: boolean;
    optionsType?: 'checkbox' | 'radio' | 'hidden';
}

export const MultipleChoiceView: React.FC<MultipleChoiceTaskProps> = ({task,optionsType='radio', scroll}) => {

    return (scroll ?
            <div style={{overflowX: "scroll", maxWidth: "100vw", width: "794px"}}>
                <div className="task multiple-choice-task">
                    <TaskHeader
                        numeration={task.numeration}
                        question={task.question}
                    />
                    <OptionsGrid
                        options={task.options}
                        optionsInARow={task.optionsInARow}
                        isMultipleChoice={true}
                        optionsType={optionsType}
                    />
                </div>
            </div> :
            <div className="task multiple-choice-task">
                <TaskHeader
                    numeration={task.numeration}
                    question={task.question}
                />
                <OptionsGrid
                    options={task.options}
                    optionsInARow={task.optionsInARow}
                    isMultipleChoice={true}
                    optionsType={optionsType}
                />
            </div>
    );
};
