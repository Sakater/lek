// WriteInTask.tsx
import React from 'react';
import type {WriteInTask as WriteInTaskType} from '../../types';
import {TaskHeader} from '../TaskHeader';
import {WritingLines} from '../helpers/WritingLines';
import {OptionsGrid} from '../helpers/OptionsGrid';

interface WriteInTaskProps {
    task: WriteInTaskType;
    scroll?: boolean;
}

export const WriteInView: React.FC<WriteInTaskProps> = ({task, scroll}) => {
    // Prüfen ob Optionen für Auflistung vorhanden sind
    const hasOptions = task.options && task.options.length > 0;

    return (scroll ?
            <div style={{overflowX: "scroll", maxWidth: "100vw"}}>
                <div className="task write-in-task">
                    <TaskHeader
                        numeration={task.numeration}
                        question={task.question}
                    />

                    {/* Optionen anzeigen, falls eine Auflistung verlangt wird */}
                    {hasOptions && (
                        <div className="task-options-list">
                            <OptionsGrid
                                options={task.options}
                                optionsInARow={1}
                                isMultipleChoice={false}
                            />
                        </div>
                    )}

                    {/* Schreiblinien für die Antwort */}
                    <WritingLines
                        helpingLines={task.helpingLines}
                        totalLines={task.totalLines}
                    />
                </div>
            </div> :
            <div className="task write-in-task">
                <TaskHeader
                    numeration={task.numeration}
                    question={task.question}
                />

                {/* Optionen anzeigen, falls eine Auflistung verlangt wird */}
                {hasOptions && (
                    <div className="task-options-list">
                        <OptionsGrid
                            options={task.options}
                            optionsInARow={1}
                            isMultipleChoice={false}
                        />
                    </div>
                )}

                {/* Schreiblinien für die Antwort */}
                <WritingLines
                    helpingLines={task.helpingLines}
                    totalLines={task.totalLines}
                />
            </div>
    );
};
