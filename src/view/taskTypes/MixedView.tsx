// MixedTask.tsx
import React from 'react';
import type {MixedTask as MixedTaskType} from '../../types';
import {TaskHeader} from '../TaskHeader';
import {OptionsGrid} from '../helpers/OptionsGrid';
import {WritingLines} from '../helpers/WritingLines';

interface MixedTaskProps {
    task: MixedTaskType;
    scroll?: boolean;
    optionsType?: 'checkbox' | 'radio' | 'hidden';
}

export const MixedView: React.FC<MixedTaskProps> = ({task, optionsType = 'checkbox', scroll}) => {
    return (scroll ?
            <div style={{overflowX: "scroll", maxWidth: "100vw"}}>
                <div className="task mixed-task">
                    <TaskHeader
                        numeration={task.numeration}
                        question={task.question}
                    />

                    {/* Multiple-Choice Teil */}
                    {task.options && task.options.length > 0 && (
                        <div className="mixed-task-options">
                            <OptionsGrid
                                options={task.options}
                                optionsInARow={task.optionsInARow}
                                isMultipleChoice={true}
                                optionsType={optionsType}
                            />
                        </div>
                    )}

                    {/* Freitext Teil mit Schreiblinien */}
                    <div className="mixed-task-writing">
                        <p className="writing-section-label">Begründung / Ausführliche Antwort:</p>
                        <WritingLines
                            helpingLines={task.helpingLines}
                            totalLines={task.totalLines}
                        />
                    </div>
                </div>
            </div> :
            <div className="task mixed-task">
                <TaskHeader
                    numeration={task.numeration}
                    question={task.question}
                />

                {/* Multiple-Choice Teil */}
                {task.options && task.options.length > 0 && (
                    <div className="mixed-task-options">
                        <OptionsGrid
                            options={task.options}
                            optionsInARow={task.optionsInARow}
                            optionsType={optionsType}
                            isMultipleChoice={true}
                        />
                    </div>
                )}

                {/* Freitext Teil mit Schreiblinien */}
                <div className="mixed-task-writing">
                    <p className="writing-section-label">Begründung / Ausführliche Antwort:</p>
                    <WritingLines
                        helpingLines={task.helpingLines}
                        totalLines={task.totalLines}
                    />
                </div>
            </div>
    );
};
