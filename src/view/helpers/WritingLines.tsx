import React from 'react';
type WritingLinesProps= {
    helpingLines: number;
    totalLines: number;
}

export function WritingLines( {helpingLines, totalLines}: WritingLinesProps) {
    const lines = [];

    for (let i = 0; i < totalLines; i++) {
        lines.push(
            <div key={i} className="writing-line-container">
                {/* Hauptlinie */}
                <div className="writing-line" />

                {/* Hilfslinien für Schreibanfänger */}
                {helpingLines > 0 && (
                    <div className="helping-lines">
                        {Array.from({ length: helpingLines }).map((_, j) => (
                            <div key={j} className="helping-line" />
                        ))}
                    </div>
                )}
            </div>
        );
    }

    return <div className="writing-lines">{lines}</div>;
};
