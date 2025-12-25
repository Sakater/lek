// MultipleChoiceTask.tsx
import React from 'react';
import type {ListingTask} from '../../types';
import {TaskHeader} from '../helpers/TaskHeader.tsx';
import {OptionsGrid} from '../helpers/OptionsGrid.tsx';

interface ListingTaskProps {
    task: ListingTask;
    scroll?: boolean;
}

export const ListingView: React.FC<ListingTaskProps> = ({task,  scroll}) => {
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
                />
            </div>
    );
};
