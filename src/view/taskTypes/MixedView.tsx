// MixedTask.tsx
import React from 'react';
import type { MixedTask as MixedTaskType } from '../../types';
import { TaskHeader } from '../TaskHeader';
import { OptionsGrid } from '../helpers/OptionsGrid';
import { WritingLines } from '../helpers/WritingLines';

interface MixedTaskProps {
    task: MixedTaskType;
}

export const MixedView: React.FC<MixedTaskProps> = ({ task }) => {
    return (
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
