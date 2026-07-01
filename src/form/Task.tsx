import {use} from 'react';
import {FileContext} from '../FileContext';
import {DeleteTwoTone, EditOutlined, HolderOutlined} from "@ant-design/icons";
import type {Task as TaskItem} from '../types';
import {TaskType} from '../types';
import {sanitizeHtmlToRaw} from "../utils/sanitizeHtml.ts";
import {DrawerContext} from "./DrawerContext";
import {Reorder, useDragControls} from "framer-motion";
import {Duplicate} from "../assets";
import "./Task.css";

type Props = {
    task: TaskItem;
    setActive: (index: number) => void;
    index: number;
};

const badgeConfig: Record<TaskType, { label: string; className: string }> = {
    [TaskType.MULTIPLE_CHOICE]: {label: "MC", className: "multiple-choice"},
    [TaskType.WRITE_IN]: {label: "Text", className: "write-in"},
    [TaskType.MIXED]: {label: "Mix", className: "mixed"},
    [TaskType.FILL_IN_THE_BLANKS]: {label: "Lücke", className: "fill-blanks"},
    [TaskType.LISTING]: {label: "Liste", className: "listing"},
    [TaskType.MAPPING]: {label: "Zuord.", className: "mapping"},
};

export function Task({task, setActive, index}: Props) {
    const {deleteTask, addTask} = use(FileContext);
    const {openDrawer, setSelectedTaskId} = use(DrawerContext);
    const dragControls = useDragControls();

    const duplicateTask = (task: TaskItem, currentIndex: number) => {
        // eslint-disable-next-line @typescript-eslint/no-unused-vars
        const {numeration, id, type, ...patch} = task;
        addTask(task.type, patch, currentIndex);
    };

    const badge = badgeConfig[task.type];

    return (
        <Reorder.Item
            as={"div"}
            value={task}
            key={task.id}
            dragListener={false}
            dragControls={dragControls}
            onDragStart={() => setActive(index)}
            className="task-form-container"
        >
            <div className="task-card">
                <div className="task-card-inner">
                    <div
                        className="task-card-drag"
                        onPointerDown={(e) => dragControls.start(e.nativeEvent)}
                    >
                        <HolderOutlined style={{fontSize: "16px"}}/>
                    </div>

                    <div className="task-card-content" onClick={() => {
                        openDrawer('taskFormOpen');
                        setSelectedTaskId(task.id);
                    }}>
                        <span className={`task-card-badge ${badge.className}`}>
                            {badge.label}
                        </span>
                        <div className="task-card-text">
                            <div className="task-card-numeration">
                                Aufgabe {sanitizeHtmlToRaw(task.numeration)}
                            </div>
                            <div
                                className="task-card-question"
                                dangerouslySetInnerHTML={{__html: sanitizeHtmlToRaw(task.question)}}
                            />
                        </div>
                    </div>

                    <div className="task-card-actions">
                        <button
                            className="task-card-action-btn"
                            title="Bearbeiten"
                            onClick={() => {
                                openDrawer('taskFormOpen');
                                setSelectedTaskId(task.id);
                            }}
                        >
                            <EditOutlined/>
                        </button>
                        <button
                            className="task-card-action-btn"
                            title="Duplizieren"
                            onClick={() => duplicateTask(task, index)}
                        >
                            <Duplicate/>
                        </button>
                        <button
                            className="task-card-action-btn delete"
                            title="Löschen"
                            onClick={() => deleteTask(task.id)}
                        >
                            <DeleteTwoTone/>
                        </button>
                    </div>
                </div>
            </div>
        </Reorder.Item>
    );
}
