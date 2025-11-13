import React, {use} from 'react';
import {FileContext} from '../FileContext';
import {Card} from 'antd';
import {CopyOutlined, DeleteTwoTone, EditOutlined, HolderOutlined} from "@ant-design/icons";
import type {Task as TaskType} from '../types';
import {sanitizeHtml, sanitizeHtmlToRaw} from "../utils/sanitizeHtml.ts";
import {DrawerContext} from "./DrawerContext";
import {Reorder, useDragControls} from "framer-motion";

type Props = {
    task: TaskType;
    setActive: (index: number) => void;
    index: number;
}

export function Task({task, setActive, index}: Props) {
    const {deleteTask} = use(FileContext);
    const {openDrawer, setSelectedTaskId} = use(DrawerContext);
    const dragControls = useDragControls();
    const [isDragEnabled, setIsDragEnabled] = React.useState(false);
    const [isDragging, setIsDragging] = React.useState(false);
    const timerRef = React.useRef<number | null>(null);
    const startPositionRef = React.useRef<{ x: number, y: number } | null>(null);
    const wasCancelledRef = React.useRef(false);
    const [touchAction, setTouchAction] = React.useState<'pan-y' | 'none'>('pan-y');

    const startDragTimer = (e: React.PointerEvent | React.TouchEvent) => {
        const clientX = 'touches' in e ? e.touches[0].clientX : e.clientX;
        const clientY = 'touches' in e ? e.touches[0].clientY : e.clientY;

        startPositionRef.current = {x: clientX, y: clientY};
        wasCancelledRef.current = false;
        setTouchAction('none');

        timerRef.current = window.setTimeout(() => {
            // Nur starten, wenn nicht abgebrochen
            if (wasCancelledRef.current) return;

            setIsDragEnabled(true);
            if ('touches' in e && e.touches.length > 0) {
                const touch = e.touches[0];
                const pointerEvent = new PointerEvent('pointerdown', {
                    clientX: touch.clientX,
                    clientY: touch.clientY,
                    bubbles: true
                });
                dragControls.start(pointerEvent);
            } else {
                dragControls.start(e as React.PointerEvent);
            }
        }, 1000);
    };

    const handleMove = (e: React.PointerEvent | React.TouchEvent) => {
        if (!startPositionRef.current || !timerRef.current) return;

        const clientX = 'touches' in e ? e.touches[0].clientX : e.clientX;
        const clientY = 'touches' in e ? e.touches[0].clientY : e.clientY;

        const dx = Math.abs(clientX - startPositionRef.current.x);
        const dy = Math.abs(clientY - startPositionRef.current.y);

        if (dx > 10 || dy > 10) {
            wasCancelledRef.current = true;
            cancelDragTimer();
        }
    };

    const cancelDragTimer = () => {
        if (timerRef.current) {
            clearTimeout(timerRef.current);
            timerRef.current = null;
        }
        setIsDragEnabled(false);
        setIsDragging(false);
        setTouchAction('pan-y');
        startPositionRef.current = null;
    };

    const actions: React.ReactNode[] = [
        <EditOutlined key="edit" onClick={() => {
            openDrawer('taskFormOpen');
            setSelectedTaskId(task.id)
        }}/>,
        <CopyOutlined key={"duplicate"}/>,
        <DeleteTwoTone key={"delete"} onClick={() => deleteTask(task.id)} className="icon-delete-2-tone"/>
    ];
    return (
        <>
            <Reorder.Item
                as={"div"}
                value={task}
                key={task.id}
                dragListener={false}
                dragControls={dragControls}
                onDragStart={() => {
                    setActive(index)
                    setIsDragging(true);
                }}
                onDragEnd={() => setIsDragging(false)}
                onPointerDown={startDragTimer}
                onPointerMove={handleMove}
                onPointerUp={cancelDragTimer}
                onPointerLeave={cancelDragTimer}
                onTouchStart={startDragTimer}
                onTouchMove={handleMove}
                onTouchEnd={cancelDragTimer}
                onTouchCancel={cancelDragTimer}
            >

                <Card actions={actions} style={{
                    minWidth: 300,
                    borderWidth: 1,
                    borderColor: "#d9d9d9",
                    touchAction: touchAction
                }}
                      extra={<HolderOutlined style={{cursor: isDragEnabled ? 'grabbing' : 'grab'}}
                      />}
                >
                    <Card.Meta
                        // avatar={<Avatar src="https://api.dicebear.com/7.x/miniavs/svg?seed=1" />}
                        title={"Aufgabe " + sanitizeHtml(task.numeration)}
                        description={
                            <>
                                <p dangerouslySetInnerHTML={{__html: sanitizeHtmlToRaw(task.question)}}/>
                            </>
                        }
                        style={{borderColor: "#d9d9d9"}}
                    />
                </Card>
            </Reorder.Item>
        </>
    )
}