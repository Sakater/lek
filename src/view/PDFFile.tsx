import React, {use, useEffect, useLayoutEffect, useRef, useState} from "react";
import {FileContext} from "../FileContext";
import {Col, Row} from "antd";
import {TasksView} from "./TasksView.tsx";
import {sanitizeHtml} from "../utils/sanitizeHtml.ts";
import type {File, Id, Task as TaskType} from "../types";

type Props = {
    file: File | null;
    size: number;
};

export function PDFFile({file, size}: Props) {
    const {dynamicSize} = use(FileContext);

    // px-Basis (stabil für html2canvas/jsPDF)
    const pxPerMm = 96 / 25.4;
    const pageWidthPx = (210 / size) * pxPerMm;
    const pageHeightPx = (297 / size) * pxPerMm;

    const border = (number: number) => (number > 1 ? "2px solid black" : "");

    const pageStyle: React.CSSProperties = {
        height: `${pageHeightPx}px`,
        width: `${pageWidthPx}px`,
        minHeight: `${pageHeightPx}px`,
        minWidth: `${pageWidthPx}px`,
        maxHeight: `${pageHeightPx}px`,
        maxWidth: `${pageWidthPx}px`,
        display: "flex",
        flexDirection: "column",
        paddingTop: "0px",
        border: border(size),
        overflow: "visible",
        alignItems: "start",
        alignContent: "unset",
        background: "white",
        boxSizing: "border-box"
    };

    // Mess-Refs und State
    const headerRef = useRef<HTMLDivElement | null>(null);
    const taskHeightsRef = useRef<Map<Id, number>>(new Map());
    const [pages, setPages] = useState<TaskType[][] | null>(null);

    // Bei file/size neu messen
    useEffect(() => {
        taskHeightsRef.current = new Map();
        setPages(null);
    }, [file, size]);

    // Paginierung, sobald alle Höhen vorliegen
    useLayoutEffect(() => {
        if (!file?.tasks?.length) return;
        if (!headerRef.current) return;
        if (taskHeightsRef.current.size !== file.tasks.length) return;

        const headerHeight = headerRef.current.offsetHeight;
        const result: TaskType[][] = [];
        let currentPage: TaskType[] = [];
        let currentHeight = headerHeight;

        for (const task of file.tasks) {
            const h = taskHeightsRef.current.get(task.id) || 0;
            if (currentHeight + h > pageHeightPx) {
                if (currentPage.length) result.push(currentPage);
                currentPage = [task];
                currentHeight = headerHeight + h;
            } else {
                currentPage.push(task);
                currentHeight += h;
            }
        }
        if (currentPage.length) result.push(currentPage);
        setPages(result);
    }, [file, pageHeightPx]);

    // Unsichtbarer Mess-Container (parallel, aber die sichtbare Ausgabe bleibt vorhanden)
    const MeasureOnce = () =>
        file ? (
            <div
                style={{
                    position: "absolute",
                    visibility: "hidden",
                    pointerEvents: "none",
                    zIndex: -1,
                    left: -999999,
                    top: 0
                }}
                aria-hidden="true"
            >
                <div style={pageStyle}>
                    <div ref={headerRef}>
                        <div style={{textAlign: "center", paddingTop: `${dynamicSize(15)}pt`, width: "100%"}}>
                            <Row justify="center">
                                <Col
                                    span={6}
                                    style={{fontSize: `${dynamicSize(13)}pt`, paddingTop: "10px"}}
                                    dangerouslySetInnerHTML={{__html: sanitizeHtml(file?.author) || ""}}
                                />
                                <Col
                                    span={12}
                                    style={{fontSize: `${dynamicSize(16)}pt`}}
                                    dangerouslySetInnerHTML={{__html: sanitizeHtml(file?.title) || ""}}
                                />
                                <Col
                                    span={6}
                                    style={{
                                        fontSize: `${dynamicSize(13)}pt`,
                                        paddingTop: "10px",
                                        paddingLeft: "20px",
                                        display: "flex",
                                        alignItems: "center"
                                    }}
                                    dangerouslySetInnerHTML={{__html: "Datum: " + (sanitizeHtml(file?.date) || "")}}
                                />
                            </Row>
                        </div>
                    </div>
                    <div style={{display: "grid", gridTemplateColumns: "auto", gridTemplateRows: "auto", width: "100%"}}>
                        {file.tasks.map(task => (
                            <div
                                key={task.id}
                                ref={el => {
                                    if (el) {
                                        taskHeightsRef.current.set(task.id, el.offsetHeight);
                                    }
                                }}
                            >
                                <TasksView task={task} size={size} />
                            </div>
                        ))}
                    </div>
                </div>
            </div>
        ) : null;

    // Header (sichtbar)
    const Header = () =>
        file ? (
            <div style={{textAlign: "center", paddingTop: `${dynamicSize(15)}pt`, width: "100%"}}>
                <Row justify="center">
                    <Col
                        span={6}
                        style={{fontSize: `${dynamicSize(13)}pt`, paddingTop: "10px"}}
                        dangerouslySetInnerHTML={{__html: sanitizeHtml(file?.author) || ""}}
                    />
                    <Col
                        span={12}
                        style={{fontSize: `${dynamicSize(16)}pt`}}
                        dangerouslySetInnerHTML={{__html: sanitizeHtml(file?.title) || ""}}
                    />
                    <Col
                        span={6}
                        style={{
                            fontSize: `${dynamicSize(13)}pt`,
                            paddingTop: "10px",
                            paddingLeft: "20px",
                            display: "flex",
                            alignItems: "center"
                        }}
                        dangerouslySetInnerHTML={{__html: "Datum: " + (sanitizeHtml(file?.date) || "")}}
                    />
                </Row>
            </div>
        ) : null;

    // Sichtbare Ausgabe:
    // - solange pages === null: Fallback (eine Seite, unpaginiert) → nie „blank”
    // - danach: echte Paginierung, TaskView wird nie geschnitten
    return (
        <div style={{textAlign: "start", display: "flex", flexDirection: "column", gap: "12px", alignItems: "center"}}>
            <MeasureOnce />
            {file &&
                (pages
                    ? pages.map((tasksOnPage, pageIndex) => (
                        <div key={pageIndex} style={pageStyle}>
                            <Header />
                            <div
                                style={{
                                    display: "grid",
                                    gridTemplateColumns: "auto",
                                    gridTemplateRows: "auto",
                                    paddingTop: `${dynamicSize(5)}px`,
                                    fontSize: `${dynamicSize(14)}pt`,
                                    width: "100%"
                                }}
                            >
                                {tasksOnPage.map(task => (
                                    <div key={task.id} className="avoid-break">
                                        <TasksView task={task} size={size} />
                                    </div>
                                ))}
                            </div>
                        </div>
                    ))
                    : (
                        <div style={pageStyle}>
                            <Header />
                            <div
                                style={{
                                    display: "grid",
                                    gridTemplateColumns: "auto",
                                    gridTemplateRows: "auto",
                                    paddingTop: `${dynamicSize(5)}px`,
                                    fontSize: `${dynamicSize(14)}pt`,
                                    width: "100%"
                                }}
                            >
                                {file.tasks.map(task => (
                                    <div key={task.id} className="avoid-break">
                                        <TasksView task={task} size={size} />
                                    </div>
                                ))}
                            </div>
                        </div>
                    ))}
        </div>
    );
}

export default React.memo(PDFFile);