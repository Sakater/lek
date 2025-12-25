// MixedTask.tsx
import React from 'react';
import type {MappingTask} from '../../types';
import {TaskHeader} from '../helpers/TaskHeader.tsx';
import {OptionsGrid} from '../helpers/OptionsGrid';

interface MappingTaskProps {
    task: MappingTask;
    scroll?: boolean;
}

export const MappingView: React.FC<MappingTaskProps> = ({task, scroll}) => {
    // For Mapping tasks, we display two sets of options to be mapped
    const sources = task.options.filter(option => option.optionType === 'source');
    const targets = task.options.filter(option => option.optionType === 'target');
    return (scroll ?
            <div style={{overflowX: "scroll", maxWidth: "100vw", width: "794px"}}>
                <div className="task multiple-choice-task">
                    <TaskHeader
                        numeration={task.numeration}
                        question={task.question}
                    />
                    <div className={"task-mapping-options"}>
                        <OptionsGrid
                            options={sources}
                            optionsInARow={1}
                        />
                        <OptionsGrid
                            options={targets}
                            optionsInARow={1}
                        />
                    </div>

                </div>
            </div> :
            <div className="task multiple-choice-task">
                <TaskHeader
                    numeration={task.numeration}
                    question={task.question}
                />
                <div className={"task-mapping-options"}>
                    <div className="task-mapping-sources">
                        <OptionsGrid
                            options={sources}
                            optionsInARow={1}
                        />
                    </div>
                    <div className="task-mapping-targets">
                        <OptionsGrid
                            options={targets}
                            optionsInARow={1}
                        />
                    </div>
                </div>
            </div>
    );
};
