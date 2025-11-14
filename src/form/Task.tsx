import {use, type ReactNode} from 'react';
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

    const actions: ReactNode[] = [
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
                            style={{cursor: 'grab', touchAction: 'none', fontSize:"17px"}}
                            onPointerDown={(e) => dragControls.start(e.nativeEvent)}
                        />
                    </div>
                    <Card.Meta
                        /*avatar={
                            <HolderOutlined
                                style={{cursor: 'grab', touchAction: 'none'}}
                                onPointerDown={(e) => dragControls.start(e)}
                            />}*/
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