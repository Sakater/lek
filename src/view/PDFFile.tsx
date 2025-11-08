// PDFFile.tsx
import React, {useEffect, useRef, useState} from 'react';
import type {File, Task} from '../types';
import {TaskView} from './TaskView';
import {sanitizeHtmlWithoutP} from "../utils/sanitizeHtml.ts";

interface PDFFileProps {
    file: File | null;
    scale?: number;
    maxPageHeight?: number; // in px, z.B. 1050px für A4
    onPaginationUpdate?: (tasks: Task[][]) => void;
}

export const PDFFile: React.FC<PDFFileProps> = ({
                                                    file,
                                                    scale = 1,
                                                    maxPageHeight = 1050, // A4 Höhe minus Header/Footer
                                                    onPaginationUpdate
                                                }) => {
    const [currentPage, setCurrentPage] = useState(1);
    const [taskHeights, setTaskHeights] = useState<Map<string, number>>(new Map());
    const [paginatedTasks, setPaginatedTasks] = useState<Task[][]>([]);
    const taskRefs = useRef<Map<string, HTMLDivElement>>(new Map());


    // Messe die Höhe aller Tasks
    // Messe die Höhe aller Tasks
    useEffect(() => {
        if (!file?.tasks || file.tasks.length === 0) return;

        const measureTasks = () => {
            const heights = new Map<string, number>();

            taskRefs.current.forEach((element, taskId) => {
                if (element) {
                    const height = element.getBoundingClientRect().height;
                    heights.set(taskId, height);
                }
            });

            // Nur State aktualisieren wenn sich Höhen tatsächlich geändert haben
            setTaskHeights(prev => {
                if (prev.size !== heights.size) return heights;

                let hasChanged = false;
                heights.forEach((height, id) => {
                    if (prev.get(id) !== height) hasChanged = true;
                });

                return hasChanged ? heights : prev;
            });
        };

        // Verzögere initiale Messung bis DOM fertig gerendert ist
        const timeoutId = setTimeout(measureTasks, 0);

        const resizeObserver = new ResizeObserver(() => {
            measureTasks();
        });

        taskRefs.current.forEach((element) => {
            if (element) {
                resizeObserver.observe(element);
            }
        });

        return () => {
            clearTimeout(timeoutId);
            resizeObserver.disconnect();
        };
    }, [file?.tasks]);

// Berechne Seiten basierend auf gemessenen Höhen
useEffect(() => {
    if (!file?.tasks || taskHeights.size === 0) return;

    // Dynamisch Header- und Footer-Höhe messen
    const headerElement = document.querySelector('.page-header');
    const footerElement = document.querySelector('.page-footer');
    const dividerElement = document.querySelector('.header-divider');

    const headerHeight = headerElement?.getBoundingClientRect().height || 80;
    const footerHeight = footerElement?.getBoundingClientRect().height || 40;
    const dividerHeight = dividerElement?.getBoundingClientRect().height || 0;

    // Dynamisch Spacing zwischen Tasks messen
    const taskWrappers = document.querySelectorAll('.task-wrapper');
    let measuredSpacing = 5; // Fallback

    if (taskWrappers.length >= 2) {
        const firstTask = taskWrappers[0].getBoundingClientRect();
        const secondTask = taskWrappers[1].getBoundingClientRect();
        measuredSpacing = secondTask.top - firstTask.bottom;
    }

    const availableHeight = maxPageHeight - headerHeight - footerHeight - dividerHeight;

    const pages: Task[][] = [];
    let currentPageTasks: Task[] = [];
    let currentPageHeight = 0;

    file.tasks.forEach((task) => {
        const taskHeight = taskHeights.get(task.id) || 0;
        const spacingToAdd = currentPageTasks.length > 0 ? measuredSpacing : 0;

        if (currentPageHeight + spacingToAdd + taskHeight <= availableHeight) {
            currentPageTasks.push(task);
            currentPageHeight += spacingToAdd + taskHeight;
        } else {
            if (currentPageTasks.length > 0) {
                pages.push([...currentPageTasks]);
            }
            currentPageTasks = [task];
            currentPageHeight = taskHeight;
        }
    });

    console.log('Available height:', availableHeight);
    console.log('Task heights:', Array.from(taskHeights.entries()));
    console.log('Header height:', headerHeight);
    console.log('Footer height:', footerHeight);
    console.log('Measured spacing:', measuredSpacing);

    if (currentPageTasks.length > 0) {
        pages.push(currentPageTasks);
    }

    setPaginatedTasks(pages);
}, [file?.tasks, taskHeights, maxPageHeight]);

// Separate Effect für Callback - nur wenn sich paginatedTasks ändert
    useEffect(() => {
        if (onPaginationUpdate && paginatedTasks.length > 0) {
            onPaginationUpdate(paginatedTasks);
        }
    }, [paginatedTasks, onPaginationUpdate]);

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
                            <span className="page-author"
                                  dangerouslySetInnerHTML={{__html: sanitizeHtmlWithoutP(file?.author) || 'Autor'}}/>
                            <div className="page-title"
                                 dangerouslySetInnerHTML={{__html: sanitizeHtmlWithoutP(file?.title) || 'Titel'}}/>
                            <span className="page-date"
                                  dangerouslySetInnerHTML={{__html: sanitizeHtmlWithoutP(file?.date) || ''}}/>

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

interface PDFExportContainerProps {
    file: File | null;
    paginatedTasks: Task[][];
}

// Erstellen Sie eine Export-Komponente die JSX zurückgibt
export const PDFExportContainer: React.FC<PDFExportContainerProps> = ({
                                                                          file,
                                                                          paginatedTasks
                                                                      }) => {
    console.log('date: ', file?.date, sanitizeHtmlWithoutP(file?.date || ''));
    return (
        <div id="pdf-export-container"
             style={{
                 opacity: 0,  // ✅ Unsichtbar aber im DOM
                 pointerEvents: 'none',  // ✅ Keine Interaktion
                 position: 'absolute',
                 top: 0,
                 left: 0,
                 zIndex: -1,
                 width: '210mm'
             }}>
            {paginatedTasks.map((pageTasks, pageIndex) => (
                <div
                    key={pageIndex}
                    className="pdf-page a4-page"
                    style={{
                        width: '210mm',
                        minHeight: '297mm',
                        padding: '20mm',
                        pageBreakAfter: 'always',
                        backgroundColor: 'white',
                        boxSizing: 'border-box',
                        position: 'relative'
                    }}
                >
                    {/* Header */}
                    <header className="page-header">
                        <span className="page-author"
                              dangerouslySetInnerHTML={{__html: sanitizeHtmlWithoutP(file?.author) || ''}}
                        />
                        <div className="page-title"
                             dangerouslySetInnerHTML={{__html: sanitizeHtmlWithoutP(file?.title) || 'Titel'}}
                        />
                        <span className="page-date"
                              dangerouslySetInnerHTML={{__html: sanitizeHtmlWithoutP(file?.date) || ''}}
                        />
                    </header>

                    <hr className="header-divider"/>

                    {/* Content - Hier verwenden wir direkt TaskView */}
                    <div className="tasks-section">
                        {pageTasks.map((task) => (
                            <TaskView key={task.id} task={task}/>
                        ))}
                    </div>

                    {/* Footer */}
                    <footer className="page-footer">
                        <div className="footer-content">
                            Seite {pageIndex + 1} von {paginatedTasks.length}
                        </div>
                    </footer>
                </div>
            ))}
        </div>
    );
};
