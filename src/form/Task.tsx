import {type ReactNode, use} from 'react';
import {FileContext} from '../FileContext';
import {Card} from 'antd';
import {DeleteTwoTone, EditOutlined, HolderOutlined} from "@ant-design/icons";
import type {Task} from '../types';
import {sanitizeHtmlToRaw} from "../utils/sanitizeHtml.ts";
import {DrawerContext} from "./DrawerContext";
import {Reorder, useDragControls} from "framer-motion";
import {Duplicate} from "../assets";

type Props = {
    task: Task;
    setActive: (index: number) => void;
    index: number;
}

export function Task({task, setActive, index}: Props) {
    const {deleteTask, addTask} = use(FileContext);
    const {openDrawer, setSelectedTaskId} = use(DrawerContext);
    const dragControls = useDragControls();

    const duplicateTask = (task: Task, currentIndex: number) => {
        // eslint-disable-next-line @typescript-eslint/no-unused-vars
        const {numeration, id, type, ...patch} = task;
        addTask(task.type, patch, currentIndex);
    };

    const actions: ReactNode[] = [
        <div className="icon-with-tooltip" data-tooltip="Bearbeiten" onClick={() => {
            openDrawer('taskFormOpen');
            setSelectedTaskId(task.id)
        }}>
            <EditOutlined key="edit"/>
        </div>,
        <div className="icon-with-tooltip" data-tooltip="Duplizieren" onClick={() => duplicateTask(task, index)}
             style={{fontWeight: 200}}>
            <Duplicate key={"duplicate"}/>
        </div>,
        <div className="icon-with-tooltip" data-tooltip="Löschen" onClick={() => deleteTask(task.id)}>
            <DeleteTwoTone key={"delete"} className="icon-delete-2-tone"/>
        </div>
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
                }}
            >
                <Card actions={actions} style={{
                    minWidth: 300,
                    borderWidth: 1,
                    borderColor: "#d9d9d9",
                }}
                >
                    <div style={{position: 'absolute', top: 20, right: 20, zIndex: 10}}>
                        <HolderOutlined
                            style={{cursor: 'grab', touchAction: 'none', fontSize: "17px"}}
                            onPointerDown={(e) => dragControls.start(e.nativeEvent)}
                        />
                    </div>
                    <Card.Meta
                        /*avatar={
                            <HolderOutlined
                                style={{cursor: 'grab', touchAction: 'none'}}
                                onPointerDown={(e) => dragControls.start(e)}
                            />}*/
                        title={"Aufgabe " + sanitizeHtmlToRaw(task.numeration)}
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