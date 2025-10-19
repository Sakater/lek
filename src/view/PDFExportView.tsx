// Fügen Sie diese Komponente am Ende von PDFFile.tsx hinzu

import {useEffect, useRef, useState} from "react";
import type {File, Task} from "../types";
import {TaskView} from "./TaskView.tsx";

type PDFFileProps = {
    file: File | null;
    maxPageHeight?: number; // in px, z.B. 1050px für A4
}

export function PDFExportView({file, maxPageHeight = 1050}: PDFFileProps) {

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

    // Gleiche Logik wie in PDFFile für Höhenmessung und Paginierung
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

    return (
        <div id="pdf-export-container" style={{}}>
            {paginatedTasks.map((pageTasks, pageIndex) => (
                <div
                    key={pageIndex}
                    className="pdf-page"
                    style={{
                        width: '210mm',
                        minHeight: '297mm',
                        padding: '20mm',
                        pageBreakAfter: 'always',
                        backgroundColor: 'white'
                    }}
                >Gute Fahrt!
                    {/* Header */}
                    <div className="pdf-header">
                        <h1>{file?.title}</h1>
                        <p>Seite {pageIndex + 1} von {paginatedTasks.length}</p>
                    </div>

                    {/* Content */}
                    <div className="pdf-content">
                        Gute Fahrt!
                        {pageTasks.map((task) => (
                            <TaskView key={task.id} task={task}/>
                        ))}
                    </div>

                    {/* Footer */}
                    <div className="pdf-footer">
                        <p>© 2025 - Generiert am {new Date().toLocaleDateString('de-DE')}</p>
                    </div>
                </div>
            ))}
        </div>
    );
};
