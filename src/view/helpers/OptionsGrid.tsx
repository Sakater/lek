import type { Option } from '../../types';
import {sanitizeHtml} from "../../utils/sanitizeHtml.ts";

type OptionsGridProps= {
    options: Option[];
    optionsInARow: number;
    isMultipleChoice?: boolean;
    optionsType?: 'checkbox' | 'radio' | 'hidden';
}

export function OptionsGrid( {options, optionsInARow, isMultipleChoice = false, optionsType}: OptionsGridProps) {
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
                            type={optionsType}
                            id={option.id.toString()}
                            name={option.id.toString()}
                            className="option-checkbox"
                        />
                    )}
                    <label htmlFor={option.id.toString()} dangerouslySetInnerHTML={{__html: sanitizeHtml(option.optionText)}}/>
                </div>
            ))}
        </div>
    );
};
