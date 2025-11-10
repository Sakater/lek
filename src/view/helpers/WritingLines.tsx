type WritingLinesProps = {
    helpingLines: number;
    totalLines: number;
}

export function WritingLines({helpingLines, totalLines}: WritingLinesProps) {
    const lines = [];

    for (let i = 0; i < totalLines; i++) {
        lines.push(<div key={i} className="writing-line-container">
            {helpingLines > 0 && (
                <>

                    {Array.from({length: helpingLines}).map((_, j) => (
                        <div key={j} className="helping-line"
                             style={{
                                 borderBottom: "solid black 1px",
                                 marginTop: `${30 / helpingLines}px` // 10px geteilt durch Anzahl Hilfslinien
                             }}/>
                    ))}

                </>)
            }
        </div>);
    }

    return <div className="writing-lines">{lines}</div>;
}
