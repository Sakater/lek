// PDFFile.tsx
import React from 'react';
import type {File} from '../types';
import {TaskView} from './TaskView';

interface PDFFileProps {
    file: File|null;
    scale?: number;
}

export const PDFFile: React.FC<PDFFileProps> = ({ file, scale = 1 }) => {
    return (
        <div className="a4-document" style={{ transform: `scale(${scale})` }}>
            {/* Erste Seite */}
            <div className="a4-page">
                <div className="page-content">
                    <header className="page-header">
                        <h1 className="page-title">{file?.title}</h1>
                        <div className="page-meta">
                            <span className="page-author">Erstellt von: {file?.author}</span>
                            <span className="page-date">Datum: {file?.date}</span>
                        </div>
                    </header>

                    <hr className="header-divider" />

                    <main className="tasks-section">
                        {file?.tasks.map((task) => (
                            <TaskView key={task.id} task={task} />
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
