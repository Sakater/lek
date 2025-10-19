// PDFFile.tsx
import React, {useEffect, useRef, useState} from 'react';
import type {File, Task} from '../types';
import {TaskView} from './TaskView';

interface PDFFileProps {
    file: File | null;
    scale?: number;
    maxPageHeight?: number; // in px, z.B. 1050px für A4
}

export const PDFFilecopy: React.FC<PDFFileProps> = ({
                                                    file,
                                                    scale = 1,
                                                    maxPageHeight = 1050 // A4 Höhe minus Header/Footer
                                                }) => {
    const [currentPage, setCurrentPage] = useState(1);
    const [taskHeights, setTaskHeights] = useState<Map<string, number>>(new Map());
    const [paginatedTasks, setPaginatedTasks] = useState<Task[][]>([]);
    const taskRefs = useRef<Map<string, HTMLDivElement>>(new Map());

    // Messe die Höhe aller Tasks
    useEffect(() => {
        if (!file?.tasks || file.tasks.length === 0) return;

        const measureTasks = () => {
            const heights = new Map<string, number>();

            taskRefs.current.forEach((element, taskId) => {
                if (element) {
                    // getBoundingClientRect gibt die tatsächliche gerenderte Höhe
                    const height = element.getBoundingClientRect().height;
                    heights.set(taskId, height);
                }
            });

            setTaskHeights(heights);
        };

        // Initiale Messung
        measureTasks();

        // ResizeObserver für dynamische Änderungen
        const resizeObserver = new ResizeObserver(() => {
            measureTasks();
        });

        taskRefs.current.forEach((element) => {
            if (element) {
                resizeObserver.observe(element);
            }
        });

        return () => {
            resizeObserver.disconnect();
        };
    }, [file?.tasks]);

    // Berechne Seiten basierend auf gemessenen Höhen
    useEffect(() => {
        if (!file?.tasks || taskHeights.size === 0) return;

        const pages: Task[][] = [];
        let currentPageTasks: Task[] = [];
        let currentPageHeight = 0;
        const SPACING = 20; // Abstand zwischen Tasks
        const HEADER_HEIGHT = 80; // Header Höhe
        const FOOTER_HEIGHT = 40; // Footer Höhe
        const availableHeight = maxPageHeight - HEADER_HEIGHT - FOOTER_HEIGHT;

        file.tasks.forEach((task) => {
            const taskHeight = taskHeights.get(task.id) || 0;

            // Prüfe, ob Task auf aktuelle Seite passt
            if (currentPageHeight + taskHeight + SPACING <= availableHeight) {
                currentPageTasks.push(task);
                currentPageHeight += taskHeight + SPACING;
            } else {
                // Task passt nicht mehr, starte neue Seite
                if (currentPageTasks.length > 0) {
                    pages.push([...currentPageTasks]);
                }
                currentPageTasks = [task];
                currentPageHeight = taskHeight + SPACING;
            }
        });

        // Füge letzte Seite hinzu
        if (currentPageTasks.length > 0) {
            pages.push(currentPageTasks);
        }

        setPaginatedTasks(pages);
    }, [file?.tasks, taskHeights, maxPageHeight]);

    const totalPages = paginatedTasks.length;
    const currentTasks = paginatedTasks[currentPage - 1] || [];

    const goToNextPage = () => {
        setCurrentPage((prev) => Math.min(prev + 1, totalPages));
    };

    const goToPreviousPage = () => {
        setCurrentPage((prev) => Math.max(prev - 1, 1));
    };

    const goToFirstPage = () => {
        setCurrentPage(1);
    };

    const goToLastPage = () => {
        setCurrentPage(totalPages);
    };

    // Ref Callback für Tasks
    const setTaskRef = (taskId: string) => (element: HTMLDivElement | null) => {
        if (element) {
            taskRefs.current.set(taskId, element);
        } else {
            taskRefs.current.delete(taskId);
        }
    };

    return (
        <div className="pdf-container">
            {/* Navigation Controls */}
            <div className="pagination-controls">
                <button
                    onClick={goToFirstPage}
                    disabled={currentPage === 1}
                    className="pagination-button"
                >
                    ⟪ Erste
                </button>
                <button
                    onClick={goToPreviousPage}
                    disabled={currentPage === 1}
                    className="pagination-button"
                >
                    ‹ Zurück
                </button>

                <span className="page-indicator">
          Seite {currentPage} von {totalPages}
        </span>

                <button
                    onClick={goToNextPage}
                    disabled={currentPage === totalPages}
                    className="pagination-button"
                >
                    Weiter ›
                </button>
                <button
                    onClick={goToLastPage}
                    disabled={currentPage === totalPages}
                    className="pagination-button"
                >
                    Letzte ⟫
                </button>
            </div>

            {/* Versteckte Messungs-Container für initiale Höhenberechnung */}
            <div
                id="measurement-container"
                style={{
                    position: 'absolute',
                    visibility: 'hidden',
                    pointerEvents: 'none',
                    width: '794px' // A4 Breite
                }}
            >
                {file?.tasks.map((task) => (
                    <div
                        key={`measure-${task.id}`}
                        ref={setTaskRef(task.id)}
                        className="task"
                    >
                        <TaskView task={task}/>
                    </div>
                ))}
            </div>

            {/* Sichtbare PDF Seite */}
            <div className="a4-container" id={'a4-container'} style={{transform: `scale(${scale})`}}>
                <div className="a4-page">
                    <div className="page-content">
                        {/* Header */}
                        <header className="page-header">
                            <span className="page-author" dangerouslySetInnerHTML={{__html: file?.author || 'Autor'}}/>
                            <div className="page-title" dangerouslySetInnerHTML={{__html: file?.title || 'Titel'}}/>
                            <span className="page-date" dangerouslySetInnerHTML={{__html: file?.date || ''}}/>

                        </header>
                        <hr className="header-divider"/>

                        {/* Tasks für aktuelle Seite */}
                        <div className="tasks-section">
                            {currentTasks.map((task) => (
                                <div
                                    key={task.id}
                                    className="task-wrapper"
                                >
                                    <TaskView task={task}/>
                                </div>
                            ))}
                        </div>

                        {/* Footer */}
                        <footer className="page-footer">
                            <div className="footer-content">
                                Seite {currentPage} von {totalPages}
                            </div>
                        </footer>
                    </div>
                </div>
            </div>
        </div>
    );
};
