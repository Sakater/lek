// PDFFile.tsx
import React from 'react';
import type {File} from '../types';
import {TaskView} from './TaskView';
import {sanitizeHtml, sanitizeHtmlWithoutP} from "../utils/sanitizeHtml.ts";

interface PDFFileProps {
    file: File | null;
    scale?: number;
}

export const PDFFile: React.FC<PDFFileProps> = ({file, scale = 1}) => {
    return (
        <div className="a4-document" style={{transform: `scale(${scale})`}}>
            {/* Erste Seite */}
            <div className="a4-page">
                <div className="page-content">
                    <header className="page-header">
                       <span className="page-author"
                             dangerouslySetInnerHTML={{__html: sanitizeHtmlWithoutP('Erstellt von: ' + file?.author)}}/>
                        <h1 className="page-title" dangerouslySetInnerHTML={{__html: sanitizeHtml(file?.title)}}/>
                        <span
                            className="page-date"
                            dangerouslySetInnerHTML={{__html: sanitizeHtml('Datum:: ' + file?.date)}}/>

                    </header>

                    <hr className="header-divider"/>

                    <main className="tasks-section">
                        {file?.tasks.map((task) => (
                            <TaskView key={task.id} task={task}/>
                        ))}
                    </main>

                    <footer className="page-footer">
                        <div className="footer-content">
                            <span>Seite 1</span>
                        </div>
                    </footer>
                </div>
            </div>

            {/* Weitere Seiten können hier dynamisch hinzugefügt werden */}
        </div>
    );
};
