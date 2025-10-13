import React from 'react';
import type { Option } from '../../types';

type OptionsGridProps= {
    options: Option[];
    optionsInARow: number;
    isMultipleChoice?: boolean;
}

export function OptionsGrid( {options, optionsInARow, isMultipleChoice = false}: OptionsGridProps) {
    return (
        <div
            className="options-grid"
            style={{
                display: 'grid',
                gridTemplateColumns: `repeat(${optionsInARow}, 1fr)`,
                gap: '10px',
                marginTop: '10px'
            }}
        >
            {options.map((option) => (
                <div key={option.id} className="option-item">
                    {isMultipleChoice && (
                        <input
                            type="checkbox"
                            id={option.id}
                            name={option.id}
                            className="option-checkbox"
                        />
                    )}
                    <label htmlFor={option.id}>{option.name}</label>
                </div>
            ))}
        </div>
    );
};
