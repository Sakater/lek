import React, {use, useEffect, useLayoutEffect, useRef, useState} from "react";
import {FileContext} from "../FileContext";
import {Button, Col, Row} from "antd";
import {TasksView} from "./TasksView.tsx";
import {sanitizeHtml} from "../utils/sanitizeHtml.ts";
import type {File, Id, Task as TaskType} from "../types";

type Props = {
    file: File | null;
    size: number;
};

export function PDFFile({file, size}: Props) {
    const {dynamicSize} = use(FileContext);

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
        overflow: "hidden",
        alignItems: "start",
        alignContent: "unset",
        background: "white",
        boxSizing: "border-box"
    };

    const headerRef = useRef<HTMLDivElement | null>(null);
    const taskHeightsRef = useRef<Map<Id, number>>(new Map());
    const [pages, setPages] = useState<TaskType[][] | null>(null);
    const [current, setCurrent] = useState(0);

    useEffect(() => {
        taskHeightsRef.current = new Map();
        setPages(null);
        setCurrent(0);
    }, [file, size]);

    // Wiederholt messen, bis Header + alle Task-Höhen vorhanden sind
    useLayoutEffect(() => {
        if (!file?.tasks?.length) {
            setPages(file ? [file.tasks] : null);
            return;
        }
        let cancelled = false;

        const computeWhenReady = () => {
            if (cancelled) return;

            if (!headerRef.current) {
                requestAnimationFrame(computeWhenReady);
                return;
            }
            if (taskHeightsRef.current.size !== file.tasks.length) {
                requestAnimationFrame(computeWhenReady);
                return;
            }

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
            setCurrent(p => Math.min(p, Math.max(0, result.length - 1)));
        };

        requestAnimationFrame(computeWhenReady);
        return () => {
            cancelled = true;
        };
    }, [file, pageHeightPx, size]);

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

    // Mess-Container: sichtbar aber off-screen, damit Höhen korrekt sind und html2canvas ihn rendern kann
    const MeasureOnce = () =>
        file ? (
            <div
                style={{
                    position: "absolute",
                    left: -100000,
                    top: 0,
                    pointerEvents: "none"
                }}
                aria-hidden="true"
            >
                <div style={pageStyle}>
                    <div ref={headerRef}>
                        <Header />
                    </div>
                    <div style={{display: "grid", gridTemplateColumns: "auto", gridTemplateRows: "auto", width: "100%"}}>
                        {file.tasks.map(task => (
                            <div
                                key={task.id}
                                ref={el => {
                                    if (el) {
                                        // mehrfaches Setzen ok, wir warten in der RAF-Schleife bis alle vorhanden sind
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

    const Page = ({tasks}: { tasks: TaskType[] }) => (
        <div className="pdf-page" style={{...pageStyle, breakAfter: "page", pageBreakAfter: "always"}}>
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
                {tasks.map(task => (
                    <div key={task.id} className="avoid-break">
                        <TasksView task={task} size={size} />
                    </div>
                ))}
            </div>
        </div>
    );

    // PDF-Container: sichtbar off-screen (keine Opazität 0!)
    const AllPagesForPdf = () =>
        file ? (
            <div
                data-pdf-root
                aria-hidden="true"
                style={{
                    position: "absolute",
                    left: -100000,
                    top: 0,
                    pointerEvents: "none"
                }}
            >
                {pages ? pages.map((tasksOnPage, i) => <Page key={i} tasks={tasksOnPage} />) : <Page tasks={file.tasks} />}
            </div>
        ) : null;

    return (
        <div style={{textAlign: "start", display: "flex", flexDirection: "column", gap: "12px", alignItems: "center"}}>
            <MeasureOnce />
            <AllPagesForPdf />
            {file && pages ? (
                <>
                    <div style={{display: "flex", alignItems: "center", gap: 8}}>
                        <Button onClick={() => setCurrent(p => Math.max(0, p - 1))} disabled={current === 0}>
                            Zurück
                        </Button>
                        <span>Seite {current + 1} / {pages.length}</span>
                        <Button onClick={() => setCurrent(p => Math.min(pages.length - 1, p + 1))} disabled={current === pages.length - 1}>
                            Weiter
                        </Button>
                    </div>
                    <Page tasks={pages[current]} />
                </>
            ) : file ? (
                <Page tasks={file.tasks} />
            ) : null}
        </div>
    );
}

export default React.memo(PDFFile);