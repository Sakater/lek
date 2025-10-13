// FillInTheBlanksTask.tsx
import React, {useState} from 'react';
import type {FillInTheBlanksTask as FillInTheBlanksTaskType} from '../../types';
import {OptionsGrid} from '../helpers/OptionsGrid';
import {sanitizeHtml} from "../../utils/sanitizeHtml.ts";

interface FillInTheBlanksTaskProps {
    task: FillInTheBlanksTaskType;
}

export const FillInTheBlanksView: React.FC<FillInTheBlanksTaskProps> = ({ task }) => {
    // State für die Eingaben in den Lücken
    const [blankValues, setBlankValues] = useState<{ [key: string]: string }>({});

    // Funktion zum Rendern des Texts mit Lücken
    const renderQuestionWithBlanks = () => {
        // Suche nach Platzhaltern wie {0}, {1}, {2} etc. im question-Text
        const parts = task.question.split(/(\{\d+\})/g);

        return parts.map((part, index) => {
            const match = part.match(/\{(\d+)\}/);

            if (match) {
                const blankId = match[1];
                return (
                    <input
                        key={`blank-${blankId}-${index}`}
                        type="text"
                        className="fill-in-blank-input"
                        value={blankValues[blankId] || ''}
                        onChange={(e) => setBlankValues({
                            ...blankValues,
                            [blankId]: e.target.value
                        })}
                        placeholder="___"
                        aria-label={`Lücke ${blankId}`}
                    />
                );
            }

            return <span key={index}>{part}</span>;
        });
    };

    return (
        <div className="task fill-in-blanks-task">
            <div className="task-header">
                <span className="task-numeration" dangerouslySetInnerHTML={{__html: sanitizeHtml(task.numeration)}}/>
                <div className="task-question-with-blanks">
                    {renderQuestionWithBlanks()}
                </div>
            </div>

            {/* Optionen als Hilfe anzeigen */}
            {task.options && task.options.length > 0 && (
                <div className="fill-in-options">
                    <p className="options-label">Mögliche Antworten:</p>
                    <OptionsGrid
                        options={task.options}
                        optionsInARow={task.optionsInARow}
                        isMultipleChoice={false}
                    />
                </div>
            )}
        </div>
    );
};
