import React from 'react';
import type {File, Task} from './types';
import {PDFExportContainer} from './view/PDFFile';

interface PDFExportViewProps {
    file: File | null;
    paginatedTasks: Task[][];
}

export const PDFExportView: React.FC<PDFExportViewProps> = ({
    file,
    paginatedTasks
}) => {
    return (
        <div id="pdf-export-view" style={{
            position: 'absolute',
            left: '-9999px',
            top: 0
        }}>
            <PDFExportContainer
                file={file}
                paginatedTasks={paginatedTasks}
            />
        </div>
    );
};