import type {Option} from '../../types';
import {sanitizeHtml} from '../../utils/sanitizeHtml.ts';

type OptionsGridProps = {
    options: Option[];
    optionsInARow: number;
};

export function OptionsGrid({ options = [], optionsInARow }: OptionsGridProps) {
    return (
        <div
            className="options-grid"
            style={{
                display: 'grid',
                gridTemplateColumns: `repeat(${optionsInARow}, 1fr)`,
                gap: '10px',
                marginTop: '10px',
            }}
        >
            {options?.map((option) =>
                option.optionType === 'source' ? (
                    <div key={option.id} className="option-item">
                        <label
                            htmlFor={option.id.toString()}
                            dangerouslySetInnerHTML={{ __html: sanitizeHtml(option.optionText) }}
                        />

                        <input
                            type={option.inputType}
                            id={option.id.toString()}
                            name={option.id.toString()}
                            className="option-checkbox"
                            checked={false}
                            readOnly
                        />
                    </div>
                ) : (
                    <div key={option.id} className="option-item">
                        <input
                            type={option.inputType}
                            id={option.id.toString()}
                            name={option.id.toString()}
                            className="option-checkbox"
                            checked={false}
                            readOnly
                        />
                        <label
                            htmlFor={option.id.toString()}
                            dangerouslySetInnerHTML={{ __html: sanitizeHtml(option.optionText) }}
                        />
                    </div>
                )
            )}
        </div>
    );
}
